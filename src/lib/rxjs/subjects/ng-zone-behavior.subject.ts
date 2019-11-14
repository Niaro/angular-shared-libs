import { BehaviorSubject } from 'rxjs';

import { ZoneService } from '@bp/shared/providers/zone.service';

export class NgZoneBehaviorSubject<T> extends BehaviorSubject<T> {

	constructor(_value?: T) {
		super(_value as T);
	}

	next(value: T): void {
		ZoneService.zone.run(() => super.next(value));
	}

}
