import { NgZone } from '@angular/core';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { AsyncScheduler } from 'rxjs/internal/scheduler/AsyncScheduler';
import { SchedulerAction } from 'rxjs/internal/types';

import { ZoneService } from '@bp/shared/providers/zone.service';

class OutsideAngularAsyncAction<T> extends AsyncAction<T> {
	constructor(
		protected scheduler: AsyncScheduler,
		protected work: (this: SchedulerAction<T>, state?: T) => void
	) {
		super(scheduler, work);
	}

	protected requestAsyncId(scheduler: AsyncScheduler, id ?: any, delay: number = 0): any {
		if (NgZone.isInAngularZone())
			return ZoneService.runOutside(() => super.requestAsyncId(scheduler, id, delay));

		return super.requestAsyncId(scheduler, id, delay);
	}
}

export const asyncOutside = new AsyncScheduler(OutsideAngularAsyncAction);
