import { Injectable, InjectionToken, Inject } from '@angular/core';
import { snakeCase, isEmpty } from 'lodash-es';
import { Subject } from 'rxjs';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';

// Add the Firebase products that you want to use
import 'firebase/storage';
import 'firebase/functions';
import { TelemetryService } from './telemetry.service';

export const FIREBASE_APP_ID = new InjectionToken('firebase_app_id');

@Injectable({
	providedIn: 'root'
})
export class FirebaseService {

	uploadProgress$ = new Subject<number | null>();

	uploadedDownloadUrl$ = new Subject<string>();

	uploadError$ = new Subject<string>();

	private storage: firebase.storage.Storage;

	private functions: firebase.functions.Functions;

	private uploadTask: firebase.storage.UploadTask;

	constructor(
		private telemetry: TelemetryService,
		@Inject(FIREBASE_APP_ID) firebaseAppId: string
	) {
		if (isEmpty(firebase.apps))
			firebase.initializeApp({
				apiKey: 'AIzaSyCE0HJJUq4otCVdCbdBINJApcVmj3h-isU',
				authDomain: 'web-hosting-213618.firebaseapp.com',
				databaseURL: 'https://web-hosting-213618.firebaseio.com',
				projectId: 'web-hosting-213618',
				storageBucket: 'web-hosting-213618.appspot.com',
				messagingSenderId: '977741303368',
				appId: firebaseAppId
			});

		this.storage = firebase.storage();
		this.functions = firebase.functions();
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

	getMondayBillingDetails(merchantId: string) {
		return this.functions.httpsCallable('getMondayBillingDetails')({ merchantId });
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
		const counter = +(counterMatchInName && counterMatchInName[1]) + 1;
		return name.replace(
			fileName,
			counterMatchInName ? fileName.replace(counterRegexp, `_${counter}`) : `${fileName}_${counter}`
		);
	}

	private snakeCaseFileName(name: string) {
		const fileName = this.getFilenameWithoutExtension(name);
		return name.replace(fileName, snakeCase(fileName));
	}

	private getFilenameWithoutExtension(name: string) {
		if (!name) return '';
		return /(.+?)(\.[^\.]+$|$)/.exec(name)[1];
	}
}
