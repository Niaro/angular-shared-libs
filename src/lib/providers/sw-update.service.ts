import * as m from 'moment';
import { ApplicationRef, Injectable, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, NEVER, Observable, Subject } from 'rxjs';
import { first, map, takeUntil, tap } from 'rxjs/operators';
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
@Injectable()
export class SwUpdatesService implements OnDestroy {
	private checkInterval = 1000 * 60 * 60 * 6; // 6 hours
	private onDestroy = new Subject<void>();

	constructor(appRef: ApplicationRef, swu: SwUpdate, snackBar: MatSnackBar) {
		if (!swu.isEnabled) return;

		// Periodically check for updates (after the app is stabilized).
		const appIsStable$ = appRef.isStable.pipe(first(v => v));
		concat(appIsStable$, interval(this.checkInterval))
			.pipe(
				tap(() => this.log('Checking for update...')),
				takeUntil(this.onDestroy)
			)
			.subscribe(() => swu.checkForUpdate());

		// Activate available updates.
		swu.available
			.pipe(
				tap(() => snackBar.open('A new version is available. The page will be reloaded in a moment.')),
				tap(evt => this.log(`Update available: ${JSON.stringify(evt)}`)),
				takeUntil(this.onDestroy)
			)
			.subscribe(() => swu.activateUpdate());

		// Notify about activated updates.
		swu.activated
			.pipe(
				tap(evt => this.log(`Update activated: ${JSON.stringify(evt)}`)),
				takeUntil(this.onDestroy)
			)
			.subscribe(() => window.location.reload());
	}

	ngOnDestroy() {
		this.onDestroy.next();
	}

	private log(message: string) {
		if (environment.name === 'prod') return;

		console.log(`%c[SwUpdates][${m().format('LLL')}]: ${message}`, 'color:#fffa39; font-size:large');
	}
}
