import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { tap, last, takeUntil } from 'rxjs/operators';
import { without } from 'lodash-es';
import { saveAs } from 'file-saver';

import { QueryParamsBase, ProcessingFile } from '../models';
import { OptionalBehaviorSubject } from '../rxjs';

@Injectable({
	providedIn: 'root'
})
export class FileLoaderService {

	private _processingFiles$ = new OptionalBehaviorSubject<ProcessingFile[]>([]);
	processingFiles$ = this._processingFiles$.asObservable();

	constructor(private http: HttpClient) { }

	download(name: string, url: string, params: QueryParamsBase): ProcessingFile {
		const file = new ProcessingFile(name, 'download');
		this.addToProcessingFiles(file);

		this.http
			.request(new HttpRequest('GET', url, {
				params,
				responseType: 'blob',
				reportProgress: true
			}))
			.pipe(
				tap(e => this.updateProgress(e, file)),
				takeUntil(file.cancel$),
				last(), // return last (completed) message to caller
			)
			.subscribe({
				next: (e: HttpResponse<Blob>) => e instanceof HttpResponse && this.save(e.body, file),
				error: val => this.handleError(val, file)
			});

		return file;
	}

	private save(blob: Blob, file: ProcessingFile) {
		saveAs(blob, file.name);
		file.finish();
		this.removeFromProcessingFiles(file);
	}

	private handleError(val: any, file: ProcessingFile): void {
		file.error(val);
		this.removeFromProcessingFiles(file);
	}

	private updateProgress(event: HttpEvent<any>, file: ProcessingFile) {
		switch (event.type) {
			case HttpEventType.UploadProgress:
			case HttpEventType.DownloadProgress:
				file.progress(Math.round(100 * event.loaded / event.total));
		}
	}

	private addToProcessingFiles(file: ProcessingFile) {
		this._processingFiles$.next([...this._processingFiles$.value, file]);
	}

	private removeFromProcessingFiles(file: ProcessingFile) {
		this._processingFiles$.next(without(this._processingFiles$.value, file));
	}

}
