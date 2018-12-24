import { NgZone } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Scheduler } from 'rxjs/internal/Scheduler';

declare var Zone: any;

class OutsideAngularZoneAction<T> extends Action<T> {
	constructor(
		protected scheduler: Scheduler,
		protected job: (this: Action<T>, state?: T) => void
	) {
		super(scheduler, job);
	}

	schedule(state?: T): Subscription {
		if (this.closed)
			return this;

		if (NgZone.isInAngularZone()) {
			const outsideZone = Zone.current.parent;
			outsideZone.run(() => this.job(state));
		} else
			this.job(state);

		return this;
	}
}

export let outside = new Scheduler(OutsideAngularZoneAction);
