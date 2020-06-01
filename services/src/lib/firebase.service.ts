import { Inject, Injectable, InjectionToken, NgZone } from '@angular/core';
import { FB_FUNCTIONS_REGION } from '@bp/firebase-functions';
import { IPageQueryParams, PagedResults, ResponseError } from '@bp/shared/models/common';
import { Entity } from '@bp/shared/models/metadata';
import { Dictionary } from '@bp/shared/typings';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/performance';
// Add the Firebase products that you want to use
import 'firebase/storage';
import { isEmpty, last, snakeCase, take } from 'lodash-es';
import m from 'moment';
import { defer, from, Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EnvironmentService } from './environment.service';
import { TelemetryService } from './telemetry';

export const FIREBASE_APP_ID = new InjectionToken('firebase_app_id');

@Injectable({
	providedIn: 'root'
})
export class FirebaseService {


	get currentUser() { return firebase.auth().currentUser; }

	uploadProgress$ = new Subject<number | null>();

	uploadedDownloadUrl$ = new Subject<string>();

	uploadError$ = new Subject<string>();

	auth!: firebase.auth.Auth;

	private _orderBy = 'updatedAt';

	private _queryDocumentSnapshotsById: Dictionary<any> = {};

	protected get _db() { return firebase.firestore(); }

	protected _storage!: firebase.storage.Storage;

	protected _functions!: firebase.functions.Functions;

	protected _uploadTask!: firebase.storage.UploadTask;

	protected _perf?: firebase.performance.Performance;


	constructor(
		protected _telemetry: TelemetryService,
		@Inject(FIREBASE_APP_ID) protected _firebaseAppId: string,
		private _zone: NgZone,
		private _env: EnvironmentService
	) {
		this._zone.runOutsideAngular(() => {
			if (isEmpty(firebase.apps))
				this._zone.runOutsideAngular(() => firebase.initializeApp({
					apiKey: 'AIzaSyCE0HJJUq4otCVdCbdBINJApcVmj3h-isU',
					authDomain: 'web-hosting-213618.firebaseapp.com',
					databaseURL: 'https://web-hosting-213618.firebaseio.com',
					projectId: 'web-hosting-213618',
					storageBucket: 'web-hosting-213618.appspot.com',
					messagingSenderId: '977741303368',
					appId: this._firebaseAppId,
				}));

			if (this._env.remoteServer)
				this._perf = firebase.performance();

			this._storage = firebase.storage();
			this._functions = firebase.app().functions(FB_FUNCTIONS_REGION);
			this.auth = firebase.auth();
		});
	}

	signIn(credentials: { userName: string, password: string; }) {
		return defer(() => from(this.auth.signInWithEmailAndPassword(credentials.userName, credentials.password))
			.pipe(catchError(this._throwAsResponseError))
		);
	}

	getDocumentId(collectionPath: string) {
		return this._db.collection(collectionPath).doc().id;
	}

	collection(collectionPath: string) {
		return this._db.collection(collectionPath);
	}

	doc(documentPath: string) {
		return this._db.doc(documentPath);
	}

	batch() {
		return this._db.batch();
	}

	arrayUnion(...elements: any[]) {
		return firebase.firestore.FieldValue.arrayUnion(...elements);
	}

	arrayRemove(...elements: any[]) {
		return firebase.firestore.FieldValue.arrayRemove(...elements);
	}

	getCollectionByQueryOnSnapshot<T>(
		collectionPath: string,
		{ page, limit, authorUid, search, orderBy, country, isShared }: IPageQueryParams & {
			search?: string;
			authorUid?: string,
			isShared?: boolean,
			country?: string,
			orderBy?: string;
		},
		factory: (data: Partial<T>) => T
	) {
		return new Observable<PagedResults<T>>(subscriber => {
			let query = this.collection(collectionPath)
				.orderBy(orderBy || this._orderBy, 'desc')
				.limit(limit);

			if (authorUid)
				query = query.where('authorUid', '==', authorUid);

			if (country)
				query = query.where('country', '==', country);

			if (isShared)
				query = query.where('isShared', '==', isShared);

			if (search) {
				// 10 is cause array-contains-any support up to 10 comparison values only.
				const searchTerms = take(search.toLowerCase().split(/\s|-/).filter(v => !!v), 10);
				if (searchTerms.length)
					query = query.where('searchTerms', 'array-contains-any', searchTerms);
			}

			if (page)
				query = query.startAfter(this._queryDocumentSnapshotsById[ page ]);

			const unsubscribe = query.onSnapshot(
				snapshot => {
					const { docs } = snapshot;
					const lastDoc = last(docs);
					const nextPageCursor = docs.length === limit && lastDoc
						? lastDoc.id
						: null;

					if (nextPageCursor)
						this._queryDocumentSnapshotsById[ nextPageCursor ] = lastDoc;

					subscriber.next(new PagedResults({
						nextPageCursor,
						firstPage: !page,
						records: docs.map(v => factory(<Partial<T>> v.data()))
					}));
				},
				e => subscriber.error(e)
			);
			return () => unsubscribe();
		})
			.pipe(catchError(this._throwAsResponseError));
	}

	getCollectionOnSnapshot<T>(
		collectionPath: string,
		factory: (data: Partial<T>) => T
	) {
		return new Observable<T[]>(subscriber => {
			const unsubscribe = this.collection(collectionPath).onSnapshot(
				snapshot => subscriber.next(snapshot.docs.map(v => factory(<Partial<T>> v.data()))),
				e => subscriber.error(e)
			);
			return () => unsubscribe();
		})
			.pipe(catchError(this._throwAsResponseError));
	}

	getCollection<T>(collectionPath: string, factory: (data: Partial<T>) => T): Observable<T[]> {
		return from(this.collection(collectionPath).get())
			.pipe(
				map(snapshot => snapshot.docs.map(v => factory(<Partial<T>> v.data()))),
				catchError(this._throwAsResponseError)
			);
	}

	getDocumentOnSnapshot<T>(
		documentPath: string,
		factory: (data: Partial<T>) => T
	) {
		return new Observable<T>(subscriber => {
			const unsubscribe = this.doc(documentPath).onSnapshot(
				snapshot => subscriber.next(factory(<Partial<T>> snapshot.data())),
				e => subscriber.error(e)
			);
			return () => unsubscribe();
		})
			.pipe(catchError(this._throwAsResponseError));
	}

	getDocument<T>(documentPath: string): Observable<Partial<T> | null> {
		return from(this.doc(documentPath).get())
			.pipe(
				map(snapshot => (<Partial<T>> snapshot.data()) || null),
				catchError(this._throwAsResponseError)
			);
	}

	delete(documentPath: string): Observable<void> {
		return from(this.doc(documentPath).delete())
			.pipe(catchError(this._throwAsResponseError));
	}

	set(documentPath: string, body: Object): Observable<void> {
		return from(this.doc(documentPath).set(JSON.parse(JSON.stringify(body)), { merge: true }))
			.pipe(catchError(this._throwAsResponseError));
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

		return this.set(`${ collectionPath }/${ entityId }`, entity)
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
		this._uploadTask && this._uploadTask.cancel();

		const fileRef = await this._getFileRef(file.name, path);

		this._uploadTask = fileRef.put(file);

		this._uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
			snapshot => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				progress > startProgressValue && this.uploadProgress$.next(progress);
			},
			error => {
				this.uploadError$.next(error.message);
				this._telemetry.captureError(error);
			},
			() => this._uploadTask.snapshot.ref
				.getDownloadURL()
				.then((downloadURL) => {
					this.uploadedDownloadUrl$.next(downloadURL);
					this.uploadProgress$.next(null);
				})
		);
	}

	getFnCall<U, T = any>(firebaseFunctionName: string, body?: T): Observable<U> {
		return from(this._functions.httpsCallable(firebaseFunctionName)(body))
			.pipe(
				map(v => v.data),
				catchError(this._throwAsResponseError)
			);
	}

	async postFnCall<T, U = void>(firebaseFunctionName: string, body: T): Promise<U> {
		const result = await this._functions.httpsCallable(firebaseFunctionName)(body);
		return result.data;
	}

	onAuthStateChange(): Observable<firebase.User | null> {
		return new Observable(subscriber => this.auth
			.onAuthStateChanged(
				v => subscriber.next(v),
				e => subscriber.error(this._mapToResponseError(e))
			)
		);
	}

	authUseDeviceLang() {
		firebase.auth().useDeviceLanguage();
	}

	private async _getFileRef(fileName: string, path: string): Promise<firebase.storage.Reference> {
		const fileRef = this._storage
			.ref(path)
			.child(this._snakeCaseFileName(fileName));

		const existFileMetadata: firebase.storage.FullMetadata = await fileRef.getMetadata()
			.catch(() => { /* swallow 404 error since the empty var would be there is no file found */ });

		return existFileMetadata
			? await this._getFileRef(this._increaseFileNameCounter(existFileMetadata.name), path)
			: fileRef;
	}

	private _increaseFileNameCounter(name: string) {
		const fileName = this._getFilenameWithoutExtension(name);
		const counterRegexp = /_(\d+)$/;
		const counterMatchInName = fileName.match(counterRegexp);
		const counter = +(counterMatchInName && counterMatchInName[ 1 ] || 0) + 1;
		return name.replace(
			fileName,
			counterMatchInName ? fileName.replace(counterRegexp, `_${ counter }`) : `${ fileName }_${ counter }`
		);
	}

	private _snakeCaseFileName(name: string) {
		const fileName = this._getFilenameWithoutExtension(name);
		return name.replace(fileName, snakeCase(fileName));
	}

	private _getFilenameWithoutExtension(name: string): string {
		if (!name) return '';
		return (<any> /(.+?)(\.[^\.]+$|$)/.exec(name))[ 1 ];
	}

	private _throwAsResponseError = (v: firebase.FirebaseError) => throwError(this._mapToResponseError(v));

	private _mapToResponseError = (e: firebase.FirebaseError | firebase.auth.Error) =>
		new ResponseError({ messages: [ { type: e.code, message: e.message } ] });
}
