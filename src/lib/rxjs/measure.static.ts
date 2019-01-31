import { Observable, Observer } from 'rxjs';
import * as fastdom from 'fastdom';
import { subscribeOn } from 'rxjs/operators';

import { BpScheduler } from './schedulers';

export function measureStatic<T>(measure: () => void | T): Observable<T> {
	return Observable
		.create((observer: Observer<void | T>) => {
			const id = fastdom.measure(() => {
				observer.next(measure());
				observer.complete();
			});
			fastdom['catch'] = (error: any) => observer.error(error);
			return () => fastdom.clear(id);
		})
		.pipe(subscribeOn(BpScheduler.outside));
}

(<any>Observable).measure = measureStatic;

declare module 'rxjs/internal/Observable' {
	namespace Observable {
		// tslint:disable-next-line:no-var-keyword
		var measure: typeof measureStatic;
	}
}
