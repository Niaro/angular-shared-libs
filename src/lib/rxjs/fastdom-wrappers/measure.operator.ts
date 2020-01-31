import { Observable, OperatorFunction } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { fromMeasure } from './measure.static';

export function measure<T, U>(measureCb: (result: T) => U): OperatorFunction<T, U>  {
	return (source$: Observable<T>) => source$.pipe(
		switchMap(v => fromMeasure(() => measureCb(v)))
	);
}
