// import { Observable } from 'rxjs';

// export function mutateOperator<T>(this: Observable<T>, mutateCb: (measured?: T) => void): Observable<T> {
// 	return this.switchMap(v => Observable
// 			.mutate(() => mutateCb(v))
// 			.map(() => v)
// 		);
// }

// Observable.prototype['mutate'] = mutateOperator;

// /**
//  * Unsubscribes from the observable and subscribes to it again when notifier
//  * emits a value
//  */
// export declare function mutate<T>(this: Observable<T>, mutate: (measured?: T) => void): Observable<T>;

// declare module 'rxjs/internal/Observable' {
// 	// tslint:disable-next-line:interface-name
// 	interface Observable<T> {
// 		mutate: typeof mutate;
// 	}
// }
