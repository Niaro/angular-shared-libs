import { Observable } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';

import { BpScheduler } from '../schedulers';

/**
 * Provides developers with a way to react to changes in a DOM, runs outside of the angular zone
 * @param {Node} target
 * @param {MutationObserverInit} [options={ attributes: true }]
 * At the very least, childList, attributes, or characterData must be set to true.
 * Otherwise, "An invalid or illegal string was specified" error is thrown.
 * @link https://developer.mozilla.org/en/docs/Web/API/MutationObserver#MutationObserverInit
 * @returns {Observable<MutationRecord[]>}
 */
export function fromMutation(target: Node, options: MutationObserverInit = { attributes: true }) {
	return new Observable<MutationRecord[]>(subscriber => {
		const mo = new MutationObserver(mutations => subscriber.next(mutations));
		mo.observe(target, options);
		return () => mo.disconnect();
	})
		.pipe(subscribeOn(BpScheduler.outside));
}
