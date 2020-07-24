import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

/**
 * Returns an Observable that skips items emitted by the source Observable until the predicate returns true
 * resubscribing to the source Observable when a second Observable emits an item.
 * @param predicate if returns true will skip the emitted value by the source Observable till first of the source
 * Observable items will return false
 * @param notifier$ The second Observable that has to emit an item to resubscribe to the source Observable
 */
export function repeatUntil<T>(predicate: (emitted: T) => boolean, notifier$: Observable<any>) {
	return (source$: Observable<T>): Observable<T> =>
		source$.pipe(
			concatMap(v => predicate(v)
				? notifier$.pipe(concatMap(() => source$.pipe(repeatUntil(predicate, notifier$))))
				: of(v)
			)
		);
}
