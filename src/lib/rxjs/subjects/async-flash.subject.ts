import { AsyncSubject } from 'rxjs';

export class AsyncFlashSubject<T> extends AsyncSubject<T> {

	complete(v?: T) {
		v && this.next(v);
		super.complete();
	}

}
