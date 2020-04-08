import { Observable, OperatorFunction, concat, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ZoneService } from '@bp/shared/providers/zone.service';

type PendingCb = (pending: boolean) => any;

export function pending<T>(callbackOrSubject$: PendingCb | Subject<boolean>): OperatorFunction<T, T> {
	return (source$: Observable<T>) => {
		let currentState: boolean;
		const emit = (state: boolean) => {
			if (state !== currentState)
				callbackOrSubject$ instanceof Subject
					? callbackOrSubject$.next(state)
					: ZoneService.zone.runTask(() => callbackOrSubject$(state));
			currentState = state;
		};

		return concat(
			new Observable<T>(subscriber => {
				emit(true);
				subscriber.complete();
			}),
			source$.pipe(tap({
				next: () => emit(false),
				error: () => emit(false),
				complete: () => emit(false)
			}))
		);
	};
}
