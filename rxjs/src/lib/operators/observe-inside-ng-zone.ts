// observeOn(BpScheduler.inside)

import { Observable } from 'rxjs';
import { observeOn } from 'rxjs/operators';

import { BpScheduler } from '../schedulers';

export function observeInsideNgZone<T>() {
	return (source$: Observable<T>) => source$.pipe(
		observeOn(BpScheduler.inside)
	);
}
