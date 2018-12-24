// import { Observable, Observer } from 'rxjs';
// import { RtScheduler } from './schedulers';
// import * as fastdom from 'fastdom';

// export function measureStatic<T>(measure: () => void | T): Observable<T> {
// 	return Observable
// 		.create((observer: Observer<void | T>) => {
// 			let id = fastdom.measure(() => {
// 				observer.next(measure());
// 				observer.complete();
// 			});
// 			fastdom['catch'] = error => observer.error(error);
// 			return () => fastdom.clear(id);
// 		})
// 		.subscribeOn(RtScheduler.outside);
// }

// (<any>Observable).measure = measureStatic;

// declare module 'rxjs/internal/Observable' {
// 	namespace Observable {
// 		// tslint:disable-next-line:no-var-keyword
// 		var measure: typeof measureStatic;
// 	}
// }
