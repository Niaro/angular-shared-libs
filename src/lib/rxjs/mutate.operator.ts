import { Observable, OperatorFunction } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export function mutate<T>(mutateCb: (measured?: T) => void): OperatorFunction<T, T> {
	return (source: Observable<T>) => source.pipe(
		switchMap(v => Observable
			.mutate(() => mutateCb(v))
			.pipe(map(() => v))
		)
	);
}
