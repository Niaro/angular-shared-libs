// import { Observable } from 'rxjs';

// export function measureOperator<T, U>(this: Observable<T>, measureCb: (node?: T) => U): Observable<U> {
// 	return this.switchMap(v => Observable.measure(() => measureCb(v)));
// }

// Observable.prototype['measure'] = measureOperator;

// /**
//  * Unsubscribes from the observable and subscribes to it again when notifier
//  * emits a value
//  */
// export declare function measure<T, U>(this: Observable<T>, measure: (node?: T) => U): Observable<U>;

// declare module 'rxjs/internal/Observable' {
// 	// tslint:disable-next-line:interface-name
// 	interface Observable<T> {
// 		measure: typeof measure;
// 	}
// }
