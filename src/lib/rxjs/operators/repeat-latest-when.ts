import { Observable, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export function repeatLatestWhen<T>(notifier$: Observable<any>) {
	return (source$: Observable<T>) =>
		combineLatest([
			source$,
			notifier$.pipe(startWith(null)),
		]).pipe(
			map(([ val ]) => val),
		);
}
