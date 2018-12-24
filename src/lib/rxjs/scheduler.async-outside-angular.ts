import { NgZone } from '@angular/core';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { AsyncScheduler } from 'rxjs/internal/scheduler/AsyncScheduler';

declare var Zone: any;

class OutsideAngularAsyncAction<T> extends AsyncAction<T> {
	constructor(
		protected scheduler: AsyncScheduler,
		protected work: (this: AsyncAction<T>, state?: T) => void
	) {
		super(scheduler, work);
	}

	protected requestAsyncId(scheduler: AsyncScheduler, id ?: any, delay: number = 0): any {
		if (NgZone.isInAngularZone()) {
			const outsideZone = Zone.current.parent;
			return outsideZone.run(() => super.requestAsyncId(scheduler, id, delay));
		}

		return super.requestAsyncId(scheduler, id, delay);
	}
}

export let asyncOutside = new AsyncScheduler(OutsideAngularAsyncAction);
