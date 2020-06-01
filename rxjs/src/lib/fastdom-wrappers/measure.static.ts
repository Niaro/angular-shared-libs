import { Observable } from 'rxjs';
import fastdom from 'fastdom';
import { subscribeOn } from 'rxjs/operators';

import { BpScheduler } from '../schedulers/schedulers';

export function fromMeasure<T>(measure: () => T) {
	return new Observable<T>(subscriber => {
		const id = fastdom.measure(() => {
			subscriber.next(measure());
			subscriber.complete();
		});
		(<any> fastdom)[ 'catch' ] = (error: any) => subscriber.error(error);
		return () => fastdom.clear(id);
	})
		.pipe(subscribeOn(BpScheduler.outside));
}
