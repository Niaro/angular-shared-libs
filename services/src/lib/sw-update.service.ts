import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import m from 'moment';
import { ToastrService } from 'ngx-toastr';
import { interval, of } from 'rxjs';
import { delay, exhaustMap, first, tap } from 'rxjs/operators';
import { CloudflareAccessService } from './cloudflare-access.service';

/**
 * SwUpdatesService
 *
 * @description
 * 1. Checks for available ServiceWorker updates once instantiated.
 * 2. Re-checks every 5 mins.
 * 3. Whenever an update is available, it activates the update.
 *
 */
@Injectable({
	providedIn: 'root',
})
export class SwUpdatesService {

	private _checkInterval = 1000 * 60 * 5; // each 5 mins

	constructor(
		private _app: ApplicationRef,
		private _swu: SwUpdate,
		private _toaster: ToastrService,
		private _cfAccess: CloudflareAccessService
	) {
		(<any> window).BP_SWU = this._swu;
	}

	reloadOnNewVersion({ checkCloudflareAuthorization }: { checkCloudflareAuthorization?: boolean; } = {}) {
		if (!this._swu.isEnabled) return;

		this._checkForUpdateOnAppIsStable();

		this._checkForUpdateInInterval(checkCloudflareAuthorization);

		this._activateUpdateAsSoonAsAvailable();

		this._whenUpdateActivatedReloadApp();
	}
	private async _checkForUpdateOnAppIsStable() {
		await this._app.isStable.pipe(first()).toPromise();
		this._checkForUpdate();
	}

	private async _whenUpdateActivatedReloadApp() {
		this._swu.activated.subscribe(() => {
			this._log(`Update activated`);
			window.location.reload();
		});
	}

	private async _activateUpdateAsSoonAsAvailable() {
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
		console.log(`%c[SwUpdates][${ m().format('LLL') }]: ${ message }`, 'color:#fd720c;');
	}
}
