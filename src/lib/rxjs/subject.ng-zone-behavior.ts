import { NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class NgZoneBehaviorSubject<T> extends BehaviorSubject<T> {
	static ngZone: NgZone;

	constructor(_value?: T) {
		super(_value as T);
	}

	next(value: T): void {
		NgZoneBehaviorSubject.ngZone.run(() => super.next(value));
	}
}
