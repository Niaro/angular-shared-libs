import { Observable, OperatorFunction } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function measure<T, U>(measureCb: (node?: T) => U): OperatorFunction<T, U>  {
	return (source: Observable<T>) => source.pipe(
		switchMap(v => Observable.measure(() => measureCb(v)))
	);
}
