import { timer } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { uniqId } from '@bp/shared/utilities';

import { BYPASS_AUTH_CHECK } from './http';

export const SKIP_CLOUDFLARE_ACCESS_CHECK = 'skip-cloudflare-access-check';

@Injectable({
	providedIn: 'root'
})
export class CloudflareAccessService {

	constructor(private _http: HttpClient) { }

	whenUserUnathorizedByCloudflareRedirectToCloudflareLoginPage() {
		timer(0, 1000 * 60 * 1)
			.subscribe(() => this.checkAccessAndTryRedirectToCFLogin());
	}

	async checkAccessAndTryRedirectToCFLogin() {
		try {
			const response = await this._http
				.get<{ url?: string; }>(`/cf-access-check?cache-bust=${ uniqId() }&${ BYPASS_AUTH_CHECK }`)
				.toPromise();

			console.log(`: -------------------------------------------------------------------------`);
			console.log(`CloudflareAccessService -> checkAccessAndTryRedirectToCFLogin -> url`, response);
			console.log(`: -------------------------------------------------------------------------`);

			console.log(`: -------------------------------------------------------------------------------------------------`);
			console.log(document.cookie);
			console.log(`: -------------------------------------------------------------------------------------------------`);
			if (response.url)
				location.href = response.url;
		} catch (error) {
			console.log(`: -----------------------------------------------------------------------------`);
			console.log(`CloudflareAccessService -> checkAccessAndTryRedirectToCFLogin -> error`, error);
			console.log(`: -----------------------------------------------------------------------------`);

		}
	}

	/**
	 * After we get redirected from the CF login page the app gets loaded by the worker
	 * thus no request is being sent to the origin server which is proxyed by CF and updates CF_Authorization
	 * cookie along the way. Thus to make a direct request to the origin server we are forced to unregister
	 * the pwa worker and get the fresh data from the origin with the updated CF_Authorization cookie
	 */
	// async refreshCFAuthorizationCookie() {

	// 	if (!navigator.serviceWorker || isDevMode())
	// 		return;

	// 	const ngswJS = `ngsw-worker.js`;

	// 	const regs = await navigator.serviceWorker
	// 		.getRegistrations();
	// 	const ngsw = regs.find(v => v.active?.scriptURL.includes(ngswJS));

	// 	if (ngsw) {
	// 		if (this._hasCFAuthorizationCookie)
	// 			this._isAuthorizedByCloudflare = true;
	// 		else {
	// 			ngsw.unregister();
	// 			location.reload();
	// 		}
	// 	} else {
	// 		// if after reload of the page we still don't have the cookie
	// 		// means the domain under the CF Access bypass policy
	// 		if (!this._hasCFAuthorizationCookie)
	// 			this._isAuthorizedByCloudflare = true;
	// 		navigator.serviceWorker.register(ngswJS);
	// 	}
	// }
}
