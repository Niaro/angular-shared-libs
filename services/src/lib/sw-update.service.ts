import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Destroyable } from '@bp/shared/models/common';
import m from 'moment';
import { ToastrService } from 'ngx-toastr';
import { interval, of } from 'rxjs';
import { delay, exhaustMap, tap } from 'rxjs/operators';
import { CloudflareAccessService } from './cloudflare-access.service';
import { EnvironmentService } from './environment.service';

/**
 * SwUpdatesService
 *
 * @description
 * 1. Checks for available ServiceWorker updates once instantiated.
 * 2. Re-checks every 5 mins.
 * 3. Whenever an update is available, it activates the update.
 *
 * @property
 * `updateActivated` {Observable<string>} - Emit the version hash whenever an update is activated.
 */
@Injectable({
	providedIn: 'root',
})
export class SwUpdatesService extends Destroyable {

	private _checkInterval = 1000 * 60 * 5; // each 5 mins

	constructor(
		private _env: EnvironmentService,
		private _swu: SwUpdate,
		private _toaster: ToastrService,
		private _cfAccess: CloudflareAccessService
	) {
		super();
	}

	reloadOnNewVersion({ checkCloudflareAuthorization }: { checkCloudflareAuthorization?: boolean; } = {}) {
		if (!this._swu.isEnabled) return;

		// Periodically check for updates (after the app is stabilized).
		interval(this._checkInterval)
			.pipe(
				exhaustMap(() => checkCloudflareAuthorization
					? this._cfAccess.checkAccessAndTryRedirectToCFLogin()
					: of()
				),
				tap(() => this._log('Checking for update...')),
				this.takeUntilDestroyed
			)
			.subscribe(() => this._swu.checkForUpdate());

		// Activate available updates.
		this._swu.available
			.pipe(
				tap(() => this._toaster.info(
					'A new version is available. The page will be reloaded in a moment.',
					undefined,
					{ disableTimeOut: true, tapToDismiss: false }
				)),
				delay(3000),
				tap(evt => this._log(`Update available: ${ JSON.stringify(evt) }`)),
				this.takeUntilDestroyed
			)
			.subscribe(() => this._swu.activateUpdate());

		// Notify about activated updates.
		this._swu.activated
			.pipe(
				tap(evt => this._log(`Update activated: ${ JSON.stringify(evt) }`)),
				this.takeUntilDestroyed
			)
			.subscribe(() => window.location.reload());
	}

	private _log(message: string) {
		if (this._env.isProd && !this._env.isDemostand) return;

		console.log(`%c[SwUpdates][${ m().format('LLL') }]: ${ message }`, 'color:#fd720c;');
	}
}
