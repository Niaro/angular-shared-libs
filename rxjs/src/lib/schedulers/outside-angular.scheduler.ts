import { Scheduler } from 'rxjs/internal/Scheduler';
import { Subscription } from 'rxjs/internal/Subscription';
import { Action } from 'rxjs/internal/scheduler/Action';

import { NgZone } from '@angular/core';

import { ZoneService } from '../zone.service';
// tslint:disable: deprecation
class OutsideAngularAction<T> extends Action<T> {
	constructor(
		// tslint:disable-next-line: naming-convention
		protected scheduler: Scheduler,
		// tslint:disable-next-line: naming-convention
		protected job: (this: Action<T>, state?: T) => void
	) {
		super(scheduler, job);
	}

	schedule(state?: T): Subscription {
		if (this.closed)
			return this;

		if (NgZone.isInAngularZone())
			ZoneService.runOutside(() => this.job(state));
		else
			this.job(state);

		return this;
	}
}

export const outside = new Scheduler(OutsideAngularAction);
