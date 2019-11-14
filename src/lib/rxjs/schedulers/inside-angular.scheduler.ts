import { NgZone } from '@angular/core';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Scheduler } from 'rxjs/internal/Scheduler';
import { Subscription } from 'rxjs/internal/Subscription';

import { ZoneService } from '@bp/shared/providers/zone.service';

class InsideAngularAction<T> extends Action<T> {
	constructor(
		protected scheduler: Scheduler,
		protected job: (this: Action<T>, state?: T) => void
	) {
		super(scheduler, job);
	}

	schedule(state?: T): Subscription {
		if (this.closed)
			return this;

		if (NgZone.isInAngularZone())
			this.job(state);
		else
			ZoneService.run(() => this.job(state));

		return this;
	}
}

export const inside = new Scheduler(InsideAngularAction);
