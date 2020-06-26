import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export function repeatLatestWhen<T>(notifier$: Observable<any>) {
	return (source$: Observable<T>) =>
		combineLatest([
			source$,
			notifier$.pipe(startWith(null)),
		])
			.pipe(map(([ val ]) => val));
}
