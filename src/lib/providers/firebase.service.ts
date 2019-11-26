import { Injectable, InjectionToken, Inject } from '@angular/core';
import { snakeCase, isEmpty, last } from 'lodash-es';
import { Subject, Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Dictionary } from 'lodash';
import * as m from 'moment';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';

// Add the Firebase products that you want to use
import 'firebase/storage';
import 'firebase/functions';
import 'firebase/firestore';
import 'firebase/auth';

import { TelemetryService } from './telemetry.service';
import { Entity, IPageQueryParams, PagedResults, ResponseError } from '../models';

export const FIREBASE_APP_ID = new InjectionToken('firebase_app_id');

@Injectable({
	providedIn: 'root'
})
export class FirebaseService {

	get currentUser() { return firebase.auth().currentUser; }

	uploadProgress$ = new Subject<number | null>();

	uploadedDownloadUrl$ = new Subject<string>();

	uploadError$ = new Subject<string>();

	private orderBy = 'updatedAt';

	private queryDocumentSnapshotsById: Dictionary<any> = {};

	protected get db() { return firebase.firestore(); }

	protected storage!: firebase.storage.Storage;

	protected functions!: firebase.functions.Functions;

	protected uploadTask!: firebase.storage.UploadTask;

	constructor(
		protected telemetry: TelemetryService,
		@Inject(FIREBASE_APP_ID) protected firebaseAppId: string
	) {
		if (isEmpty(firebase.apps))
			firebase.initializeApp({
				apiKey: 'AIzaSyCE0HJJUq4otCVdCbdBINJApcVmj3h-isU',
				authDomain: 'web-hosting-213618.firebaseapp.com',
				databaseURL: 'https://web-hosting-213618.firebaseio.com',
				projectId: 'web-hosting-213618',
				storageBucket: 'web-hosting-213618.appspot.com',
				messagingSenderId: '977741303368',
				appId: this.firebaseAppId
			});

		this.storage = firebase.storage();
		this.functions = firebase.functions();
	}

	signIn(credentials: { userName: string, password: string }) {
		return from(firebase.auth().signInWithEmailAndPassword(credentials.userName, credentials.password))
			.pipe(catchError(this.throwAsResponseError));
	}

	getDocumentId(collectionPath: string) {
		return this.db.collection(collectionPath).doc().id;
	}

	collection(collectionPath: string) {
		return this.db.collection(collectionPath);
	}

	doc(documentPath: string) {
		return this.db.doc(documentPath);
	}

	batch() {
		return this.db.batch();
	}

	arrayUnion(...elements: any[]) {
		return firebase.firestore.FieldValue.arrayUnion(...elements);
	}

	arrayRemove(...elements: any[]) {
		return firebase.firestore.FieldValue.arrayRemove(...elements);
	}

	onQuerySnapshot<T extends Entity>(
		path: string,
		{ page, limit, authorUid }: IPageQueryParams & { authorUid?: string },
		factory: (data: Partial<T>) => T
	) {
		return new Observable<PagedResults<T>>(subscriber => {
			let query = this.collection(path)
				.orderBy(this.orderBy, 'desc')
				.limit(limit);

			if (authorUid)
				query = query.where('authorUid', '==', authorUid);

			if (page)
				query = query.startAfter(this.queryDocumentSnapshotsById[page]);

			const unsubscribe = query.onSnapshot(
				snapshot => {
					const { docs } = snapshot;
					const lastDoc = last(docs);
					const nextPageCursor = docs.length === limit && lastDoc
						? lastDoc.id
						: null;

					if (nextPageCursor)
						this.queryDocumentSnapshotsById[nextPageCursor] = lastDoc;

					subscriber.next(new PagedResults({
						nextPageCursor,
						firstPage: !page,
						records: docs.map(v => factory(v.data() as Partial<T>))
					}));
				},
				e => subscriber.error(e)
			);
			return () => unsubscribe();
		})
			.pipe(catchError(this.throwAsResponseError));
	}

	onSnapshot<T>(
		path: string,
		factory: (data: Partial<T>) => T
	) {
		return new Observable<T[]>(subscriber => {
			const unsubscribe = this.collection(path).onSnapshot(
				snapshot => subscriber.next(snapshot.docs.map(v => factory(v.data() as Partial<T>))),
				e => subscriber.error(e)
			);
			return () => unsubscribe();
		})
			.pipe(catchError(this.throwAsResponseError));
	}

	getListOnce<T>(collectionPath: string, factory: (data: Partial<T>) => T): Observable<T[]> {
		return from(this.collection(collectionPath).get())
			.pipe(
				map(snapshot => snapshot.docs.map(v => factory(v.data() as Partial<T>))),
				catchError(this.throwAsResponseError)
			);
	}

	getOnce<T>(documentPath: string): Observable<Partial<T> | null> {
		return from(this.doc(documentPath).get())
			.pipe(
				map(snapshot => (snapshot.data() as Partial<T>) || null),
				catchError(this.throwAsResponseError)
			);
	}

	delete(documentPath: string): Observable<void> {
		return from(this.doc(documentPath).delete())
			.pipe(catchError(this.throwAsResponseError));
	}

	set(documentPath: string, body: Entity): Observable<void> {
		return from(this.doc(documentPath).set(body.toJSON()))
			.pipe(catchError(this.throwAsResponseError));
	}

	save<T extends Entity>(
		collectionPath: string,
		entity: T,
		factory: (data: Partial<T>) => T
	) {
		const isAdding = !entity.id;
		const entityId = entity.id || this.getDocumentId(collectionPath);

		const patch: Partial<Entity> = isAdding
			? {
				authorUid: this.currentUser && this.currentUser.uid,
				createdAt: m(),
				updatedAt: m()
			}
			: { updatedAt: m() };
		patch.id = entityId;

		entity = factory({
			...entity,
			...patch
		});

		return this.set(`${collectionPath}/${entityId}`, entity)
			.pipe(map(() => entity));
	}

	/**
	 * Upload file to a specific folder path in firebase storage
	 * @param path A relative path to initialize the reference with,
	 * for example path/to/image.jpg. If not passed, the returned
	 * reference points to the bucket root.
	 */
	async upload(file: File, path: string) {
		const startProgressValue = 25;

		this.uploadProgress$.next(startProgressValue);
		this.uploadTask && this.uploadTask.cancel();

		const fileRef = await this.getFileRef(file.name, path);

		this.uploadTask = fileRef.put(file);

		this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
			snapshot => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				progress > startProgressValue && this.uploadProgress$.next(progress);
			},
			error => {
				this.uploadError$.next(error.message);
				this.telemetry.captureError(error);
			},
			() => this.uploadTask.snapshot.ref
				.getDownloadURL()
				.then((downloadURL) => {
					this.uploadedDownloadUrl$.next(downloadURL);
					this.uploadProgress$.next(null);
				})
		);
	}

	getFnCall<U, T = any>(firebaseFunctionName: string, body?: T): Observable<U> {
		return from(this.functions.httpsCallable(firebaseFunctionName)(body))
			.pipe(
				map(v => v.data),
				catchError(this.throwAsResponseError)
			);
	}

	async postFnCall<T>(firebaseFunctionName: string, body: T): Promise<void> {
		await this.functions.httpsCallable(firebaseFunctionName)(body);
	}

	onAuthStateChange(): Observable<firebase.User | null> {
		return new Observable(subscriber => firebase
			.auth()
			.onAuthStateChanged(
				v => subscriber.next(v),
				e => subscriber.error(this.mapToResponseError(e))
			)
		);
	}

	authUseDeviceLang() {
		firebase.auth().useDeviceLanguage();
	}

	private async getFileRef(fileName: string, path: string): Promise<firebase.storage.Reference> {
		const fileRef = this.storage
			.ref(path)
			.child(this.snakeCaseFileName(fileName));

		const existFileMetadata: firebase.storage.FullMetadata = await fileRef.getMetadata()
			.catch(() => { /* swallow 404 error since the empty var would be there is no file found */ });

		return existFileMetadata
			? await this.getFileRef(this.increaseFileNameCounter(existFileMetadata.name), path)
			: fileRef;
	}

	private increaseFileNameCounter(name: string) {
		const fileName = this.getFilenameWithoutExtension(name);
		const counterRegexp = /_(\d+)$/;
		const counterMatchInName = fileName.match(counterRegexp);
		const counter = +(counterMatchInName && counterMatchInName[1] || 0) + 1;
		return name.replace(
			fileName,
			counterMatchInName ? fileName.replace(counterRegexp, `_${counter}`) : `${fileName}_${counter}`
		);
	}

	private snakeCaseFileName(name: string) {
		const fileName = this.getFilenameWithoutExtension(name);
		return name.replace(fileName, snakeCase(fileName));
	}

	private getFilenameWithoutExtension(name: string): string {
		if (!name) return '';
		return (<any>/(.+?)(\.[^\.]+$|$)/.exec(name))[1];
	}

	private throwAsResponseError = (v: firebase.FirebaseError) => throwError(this.mapToResponseError(v));

	private mapToResponseError = (e: firebase.FirebaseError | firebase.auth.Error) =>
		new ResponseError({ messages: [{ type: e.code, message: e.message }] })
}
