// import { Observable } from 'rxjs';
// import { RtScheduler } from './schedulers';

// /**
//  * Provides developers with a way to react to changes in a DOM, runs outside of the angular zone
//  * @param {Node} target
//  * @param {MutationObserverInit} [options={ attributes: true }]
//  * At the very least, childList, attributes, or characterData must be set to true.
//  * Otherwise, "An invalid or illegal string was specified" error is thrown.
//  * @link https://developer.mozilla.org/en/docs/Web/API/MutationObserver#MutationObserverInit
//  * @returns {Observable<MutationRecord[]>}
//  */
// export function mutation(target: Node, options: MutationObserverInit = { attributes: true }): Observable<MutationRecord[]> {
// 	return Observable
// 		.create(observer => {
// 			let mo = new MutationObserver(mutations => observer.next(mutations));
// 			mo.observe(target, options);
// 			return () => mo.disconnect();
// 		})
// 		.subscribeOn(RtScheduler.outside);
// }

// (<any>Observable).fromMutation = mutation;

// declare module 'rxjs/internal/Observable' {
// 	namespace Observable {
// 		// tslint:disable-next-line:no-var-keyword
// 		var fromMutation: typeof mutation;
// 	}
// }
