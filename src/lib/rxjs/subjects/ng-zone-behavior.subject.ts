import { BehaviorSubject } from 'rxjs';

import { ZoneService } from '@bp/shared/providers/zone.service';

export class NgZoneBehaviorSubject<T> extends BehaviorSubject<T> {

	constructor(value?: T) {
		super(<T> value);
	}

	next(value: T): void {
		ZoneService.zone.run(() => super.next(value));
	}

}
