import * as m from 'moment';
import { ApplicationRef, Injectable, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, Subject } from 'rxjs';
import { first, takeUntil, tap, startWith, delay } from 'rxjs/operators';
import { environment } from '@bp/environment';
import { MatSnackBar } from '@angular/material';

/**
 * SwUpdatesService
 *
 * @description
 * 1. Checks for available ServiceWorker updates once instantiated.
 * 2. Re-checks every 6 hours.
 * 3. Whenever an update is available, it activates the update.
 *
 * @property
 * `updateActivated` {Observable<string>} - Emit the version hash whenever an update is activated.
 */
@Injectable({
	providedIn: 'root',
})
export class SwUpdatesService implements OnDestroy {
	private checkInterval = 1000 * 60 * 60 * 6; // 6 hours
	private destroyed$ = new Subject<void>();

	constructor(appRef: ApplicationRef, swu: SwUpdate, snackBar: MatSnackBar) {
		if (!swu.isEnabled) return;

		// Periodically check for updates (after the app is stabilized).
		const appIsStable$ = appRef.isStable.pipe(first(v => v));
		concat(appIsStable$, interval(this.checkInterval).pipe(startWith(null)))
			.pipe(
				tap(() => this.log('Checking for update...')),
				takeUntil(this.destroyed$)
			)
			.subscribe(() => swu.checkForUpdate());

		// Activate available updates.
		swu.available
			.pipe(
				tap(() => snackBar.open('A new version is available. The page will be reloaded in a moment.')),
				delay(3000),
				tap(evt => this.log(`Update available: ${JSON.stringify(evt)}`)),
				takeUntil(this.destroyed$)
			)
			.subscribe(() => swu.activateUpdate());

		// Notify about activated updates.
		swu.activated
			.pipe(
				tap(evt => this.log(`Update activated: ${JSON.stringify(evt)}`)),
				takeUntil(this.destroyed$)
			)
			.subscribe(() => window.location.reload());
	}

	ngOnDestroy() {
		this.destroyed$.next();
	}

	private log(message: string) {
		if (environment.name === 'prod') return;

		console.log(`%c[SwUpdates][${m().format('LLL')}]: ${message}`, 'color:#fd720c;');
	}
}
