import { Observable } from 'rxjs';
import * as fastdom from 'fastdom';
import { subscribeOn } from 'rxjs/operators';

import { BpScheduler } from '../schedulers/schedulers';

export function fromMutate<T>(mutate: () => void): Observable<void> {
	return new Observable<void>(subscriber => {
		const id = fastdom.mutate(() => {
			mutate();
			subscriber.next();
			subscriber.complete();
		});
		(<any>fastdom)['catch'] = (error: any) => subscriber.error(error);
		return () => fastdom.clear(id);
	})
		.pipe(subscribeOn(BpScheduler.outside));
}
