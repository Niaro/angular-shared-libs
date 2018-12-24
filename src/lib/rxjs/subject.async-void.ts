import { AsyncSubject } from 'rxjs';

export class AsyncVoidSubject extends AsyncSubject<void> {
	complete() {
		this.next(undefined);
		super.complete();
	}
}
