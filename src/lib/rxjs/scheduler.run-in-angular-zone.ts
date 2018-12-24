import { NgZone } from '@angular/core';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Scheduler } from 'rxjs/internal/Scheduler';
import { Subscription } from 'rxjs/internal/Subscription';

class RunInAngularZoneAction<T> extends Action<T> {
	constructor(
		protected scheduler: NgZoneScheduler,
		protected work: (this: Action<T>, state?: T) => void
	) {
		super(scheduler, work);
	}

	schedule(state?: T): Subscription {
		if (this.closed)
			return this;

		this.scheduler.zone.run(() => this.work(state));
		return this;
	}
}

export class NgZoneScheduler extends Scheduler {
	constructor(SchedulerAction: typeof RunInAngularZoneAction, public zone: NgZone) {
		super(SchedulerAction);
	}
}

export function runInAngularZoneFactory(zone: NgZone) { return new NgZoneScheduler(RunInAngularZoneAction, zone); }
