import { Observable, OperatorFunction } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { fromMutate } from './mutate.static';

export function mutate<T>(mutateCb: (measured: T) => void): OperatorFunction<T, T> {
	return (source$: Observable<T>) => source$.pipe(
		switchMap(v => fromMutate(() => mutateCb(v))
			.pipe(map(() => v))
		)
	);
}
