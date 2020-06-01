import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { tap, last, takeUntil } from 'rxjs/operators';
import { without } from 'lodash-es';
import { saveAs } from 'file-saver';

import { OptionalBehaviorSubject } from '@bp/shared/rxjs';
import { ProcessingFile, QueryParamsBase, ResponseError } from '@bp/shared/models/common';

@Injectable({
	providedIn: 'root'
})
export class FileLoaderService {

	private _processingFiles$ = new OptionalBehaviorSubject<ProcessingFile[]>([]);
	processingFiles$ = this._processingFiles$.asObservable();

	constructor(private _http: HttpClient) { }

	download(name: string, url: string, params: QueryParamsBase): ProcessingFile {
		const file = new ProcessingFile(name, 'download');
		this._addToProcessingFiles(file);

		this._http
			.request<Blob>(new HttpRequest('GET', url, {
				params,
				responseType: 'blob',
				reportProgress: true
			}))
			.pipe(
				tap(e => this._updateProgress(e, file)),
				takeUntil(file.cancel$),
				last(), // return last (completed) message to caller
			)
			.subscribe({
				next: e => e instanceof HttpResponse && e.body && saveAs(e.body, file.name),
				error: (val) => this._handleError(val, file),
				complete: () => this._complete(file)
			});

		return file;
	}

	private _complete(file: ProcessingFile) {
		file.finish();
		this._removeFromProcessingFiles(file);
	}

	private _handleError(val: ResponseError, file: ProcessingFile): void {
		file.error(val);
		this._removeFromProcessingFiles(file);
	}

	private _updateProgress(event: HttpEvent<any>, file: ProcessingFile) {
		switch (event.type) {
			case HttpEventType.UploadProgress:
			case HttpEventType.DownloadProgress:
				file.progress = Math.round(event.total ? 100 * event.loaded / event.total : 88);
		}
	}

	private _addToProcessingFiles(file: ProcessingFile) {
		this._processingFiles$.next([ ...(this._processingFiles$.value || []), file ]);
	}

	private _removeFromProcessingFiles(file: ProcessingFile) {
		this._processingFiles$.next(without(this._processingFiles$.value, file));
	}

}
