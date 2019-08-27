import { BehaviorSubject, AsyncSubject } from 'rxjs';

import { AsyncVoidSubject } from '../../rxjs';
import { Enumeration } from '../misc';

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

	private _status$ = new BehaviorSubject<ProcessingFileStatus>(ProcessingFileStatus.inProgress);
	status$ = this._status$.asObservable();
	get status() { return this._status$.value; }
	get isInProgress() { return this.status === ProcessingFileStatus.inProgress; }
	get isFinished() { return this.status === ProcessingFileStatus.finish; }
	get isCanceled() { return this.status === ProcessingFileStatus.canceled; }
	get hasError() { return this.status === ProcessingFileStatus.error; }

	error$ = new AsyncSubject<string>();

	cancel$ = new AsyncVoidSubject();

	constructor(
		public name: string,
		private type: 'download' | 'upload'
	) { }

	progress(val: number) {
		val > this.startProgressValue && this._progress$.next(val);
	}

	finish() {
		this._status$.next(ProcessingFileStatus.finish);
	}

	error(val: string) {
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
