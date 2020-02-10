import { BehaviorSubject, AsyncSubject } from 'rxjs';

import { AsyncVoidSubject } from '../../rxjs';
import { Enumeration } from '../misc';
import { ResponseError } from './response-error';

export class ProcessingFileStatus extends Enumeration {
	static inProgress = new ProcessingFileStatus();
	static finish = new ProcessingFileStatus();
	static canceled = new ProcessingFileStatus();
	static error = new ProcessingFileStatus();
}

export class ProcessingFile {

	private readonly startProgressValue = 25; // imitate TTFB

	isDownload = this.type === 'download';

	isUpload = this.type === 'upload';

	private _progress$ = new BehaviorSubject(this.startProgressValue);
	progress$ = this._progress$.asObservable();
	get progress() { return this._progress$.value; }
	set progress(val: number) {
		val > this.startProgressValue && this._progress$.next(val);
	}

	private _status$ = new BehaviorSubject<ProcessingFileStatus>(ProcessingFileStatus.inProgress);
	status$ = this._status$.asObservable();
	get status() { return this._status$.value; }

	get isInProgress() { return this.status === ProcessingFileStatus.inProgress; }

	get isFinished() { return this.status === ProcessingFileStatus.finish; }

	get isCanceled() { return this.status === ProcessingFileStatus.canceled; }

	get hasError() { return this.status === ProcessingFileStatus.error; }

	error$ = new AsyncSubject<ResponseError>();

	cancel$ = new AsyncVoidSubject();

	constructor(
		public name: string,
		private type: 'download' | 'upload'
	) {
		this.name = name.replace(/\//g, ' ̸ ');
	}

	finish() {
		if (this.progress < 100)
			this.progress = 100;
		this._status$.next(ProcessingFileStatus.finish);
	}

	error(val: ResponseError) {
		this.error$.next(val);
		this.error$.complete();
		this._status$.next(ProcessingFileStatus.error);
	}

	cancel() {
		if (this.isInProgress) {
			this.cancel$.complete();
			this._status$.next(ProcessingFileStatus.canceled);
		}
	}
}
