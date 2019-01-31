import { Observable, Observer } from 'rxjs';
import * as fastdom from 'fastdom';
import { subscribeOn } from 'rxjs/operators';

import { BpScheduler } from './schedulers';

export function mutateStatic<T>(mutate: () => void): Observable<void> {
	return Observable
		.create((observer: Observer<void>) => {
			const id = fastdom.mutate(() => {
				mutate();
				observer.next(undefined);
				observer.complete();
			});
			fastdom['catch'] = error => observer.error(error);
			return () => fastdom.clear(id);
		})
		.pipe(subscribeOn(BpScheduler.outside));
}

(<any>Observable).mutate = mutateStatic;

declare module 'rxjs/internal/Observable' {
	namespace Observable {
		// tslint:disable-next-line:no-var-keyword
		var mutate: typeof mutateStatic;
	}
}
