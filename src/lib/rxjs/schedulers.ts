export * from './scheduler.run-in-angular-zone';
export * from './scheduler.outside-angular';
export * from './scheduler.async-outside-angular';

import { Scheduler } from 'rxjs/internal/Scheduler';
import { asyncOutside } from './scheduler.async-outside-angular';
import { outside } from './scheduler.outside-angular';

export class BpScheduler {
	static runInAngularZone: Scheduler;
	static asyncOutside = asyncOutside;
	static outside = outside;
}
