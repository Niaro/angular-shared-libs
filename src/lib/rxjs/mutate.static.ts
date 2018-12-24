// import { Observable, Observer } from 'rxjs';
// import { RtScheduler } from './schedulers';
// import * as fastdom from 'fastdom';

// export function mutateStatic<T>(mutate: () => void): Observable<void> {
// 	return Observable
// 		.create((observer: Observer<void>) => {
// 			let id = fastdom.mutate(() => {
// 				mutate();
// 				observer.next(undefined);
// 				observer.complete();
// 			});
// 			fastdom['catch'] = error => observer.error(error);
// 			return () => fastdom.clear(id);
// 		})
// 		.subscribeOn(RtScheduler.outside);
// }

// (<any>Observable).mutate = mutateStatic;

// declare module 'rxjs/internal/Observable' {
// 	namespace Observable {
// 		// tslint:disable-next-line:no-var-keyword
// 		var mutate: typeof mutateStatic;
// 	}
// }
