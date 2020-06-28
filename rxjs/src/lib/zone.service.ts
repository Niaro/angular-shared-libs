import { Injectable, NgZone } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ZoneService {

	static zone: NgZone;

	static run<T>(fn: (...args: any[]) => T): T {
		return ZoneService.zone.run(fn);
	}

	static runOutside<T>(fn: (...args: any[]) => T): T {
		return ZoneService.zone.runOutsideAngular(fn);
	}

	constructor(private _zone: NgZone) {

	}

	init() {
		ZoneService.zone = this._zone;
	}

}
