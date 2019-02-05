import { Injectable, NgZone } from '@angular/core';
import { BpScheduler, NgZoneBehaviorSubject, runInAngularZoneFactory } from '../rxjs';

@Injectable()
export class RxJSExtenderService {
	constructor(zone: NgZone) {
		BpScheduler.runInAngularZone = runInAngularZoneFactory(zone);
		NgZoneBehaviorSubject.ngZone = zone;
	}
}
