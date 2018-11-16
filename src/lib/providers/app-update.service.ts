import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { filter, flatMap } from 'rxjs/operators';

@Injectable()
export class AppUpdateService {
	constructor(updates: SwUpdate) {
		updates.available
			.pipe(
				filter(() => confirm('A new version is available. Would you like to install it?')),
				flatMap(() => updates.activateUpdate())
			)
			.subscribe(() => document.location.reload());
	}
}
