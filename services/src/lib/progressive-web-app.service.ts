import m from 'moment';
import { ToastrService } from 'ngx-toastr';
import { interval, of } from 'rxjs';
import { delay, exhaustMap, first, tap } from 'rxjs/operators';

import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { CloudflareAccessService } from './cloudflare-access.service';
import { TelemetryService } from './telemetry';

/**
 * @description
 * 1. Checks for available ServiceWorker updates once instantiated.
 * 2. Re-checks every 5 mins.
 * 3. Whenever an update is available, it activates the update and reloads the page.
 * 4. Logs each time PWA gets installed
 *
 */
@Injectable({
	providedIn: 'root',
})
export class ProgressiveWebAppService {

	private _checkInterval = 1000 * 60 * 5; // each 5 mins

	constructor(
		private _app: ApplicationRef,
		private _swu: SwUpdate,
		private _toaster: ToastrService,
		private _cfAccess: CloudflareAccessService
	) {
		(<any> window).BP_SWU = this._swu;
		this._logPWAInstalledEvent();
		this._logPWADisplayMode();
	}

	reloadOnNewVersion({ checkCloudflareAuthorization }: { checkCloudflareAuthorization?: boolean; } = {}) {
		if (!this._swu.isEnabled) return;

		this._checkForUpdateOnAppIsStable();

		this._checkForUpdateInInterval(checkCloudflareAuthorization);

		this._activateUpdateAsSoonAsAvailable();

		this._whenUpdateActivatedReloadApp();
	}

	private async _checkForUpdateOnAppIsStable() {
		await this._app.isStable
			.pipe(first())
			.toPromise();

		this._checkForUpdate();
	}

	private _whenUpdateActivatedReloadApp() {
		this._swu.activated.subscribe(() => {
			this._log(`Update activated`);
			window.location.reload();
		});
	}

	private _activateUpdateAsSoonAsAvailable() {
		this._swu.available
			.pipe(
				tap(() => this._showNewVersionIsAvailableToast()),
				delay(3000)  // time to read the message
			)
			.subscribe(() => this._swu.activateUpdate());
	}

	private _showNewVersionIsAvailableToast() {
		this._log(`Update available`);

		this._toaster.info(
			'A new version is available. The page will be reloaded in a moment.',
			undefined,
			{ disableTimeOut: true, tapToDismiss: false }
		);
	}

	private _checkForUpdateInInterval(checkCloudflareAuthorization: boolean | undefined) {
		interval(this._checkInterval)
			.pipe(exhaustMap(() => checkCloudflareAuthorization
				? this._cfAccess.checkAccessAndTryRedirectToCFLogin()
				: of()
			))
			.subscribe(() => this._checkForUpdate());
	}

	private _checkForUpdate(): void {
		this._log('Checking for update...');
		this._swu.checkForUpdate();
	}

	private _log(message: string) {
		// tslint:disable-next-line: newline-per-chained-call
		console.log(`%c[PWA][${ m().format('LLL') }]: ${ message }`, 'color:#fd720c;');
	}

	private _logPWAInstalledEvent() {
		window.addEventListener('appinstalled', () => TelemetryService.captureMessage('PWA got installed'));
	}

	private _logPWADisplayMode() {
		if (window.matchMedia('(display-mode: standalone)').matches)
			TelemetryService.captureMessage('PWA is started as standalone');
	}
}
