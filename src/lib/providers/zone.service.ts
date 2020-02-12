import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class ZoneService {

	static zone: NgZone;

	static run<T>(fn: (...args: any[]) => T): T {
		return ZoneService.zone.run(fn);
	}

	static runOutside<T>(fn: (...args: any[]) => T): T {
		return ZoneService.zone.runOutsideAngular(fn);
	}

	constructor(zone: NgZone) {
		ZoneService.zone = zone;
	}

}
