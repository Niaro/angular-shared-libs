import { timer } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { uniqId } from '@bp/shared/utilities';

import { BYPASS_AUTH_CHECK } from './http';
import { TelemetryService } from './telemetry';

export const SKIP_CLOUDFLARE_ACCESS_CHECK = 'skip-cloudflare-access-check';

export const CLOUDFLARE_ACCESS_CHECK_PATHNAME = 'cf-access-check';

@Injectable({
	providedIn: 'root'
})
export class CloudflareAccessService {

	constructor(private _http: HttpClient) { }

	whenUserUnathorizedByCloudflareRedirectToCloudflareLoginPage(): void {
		timer(0, 1000 * 60 * 60 * 1)
			.subscribe(() => this.checkAccessAndTryRedirectToCFLogin());
	}

	async checkAccessAndTryRedirectToCFLogin(): Promise<void> {
		try {
			const { url } = await this._tryGetCloudflareLoginUrl();

			if (url) {
				TelemetryService.captureMessage('Cloudflare Login Page Redirect');
				location.href = url;
			}
		} catch (error) { }
	}

	private _tryGetCloudflareLoginUrl(): Promise<{ url?: string; }> {
		return this._http
			.get(`/${ CLOUDFLARE_ACCESS_CHECK_PATHNAME }?cache-bust=${ uniqId() }&${ BYPASS_AUTH_CHECK }`)
			.toPromise();
	}
}
