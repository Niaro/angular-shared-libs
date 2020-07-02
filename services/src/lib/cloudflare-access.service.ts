import Cookies from 'js-cookie';
import { Observable, timer } from 'rxjs';
import { mergeMapTo, tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { uniqId } from '@bp/shared/utilities';

import { BYPASS_AUTH_CHECK } from './http';

export const SKIP_CLOUDFLARE_ACCESS_CHECK = 'skip-cloudflare-access-check';

export const CLOUDFLARE_ACCESS_CHECK_PATHNAME = 'cf-access-check';

@Injectable({
	providedIn: 'root'
})
export class CloudflareAccessService {

	constructor(private _http: HttpClient) {

		timer(0, 1000 * 30)
			.pipe(
				mergeMapTo(this._tryGetCloudflareLoginUrl()),
				tap(() => console.warn('CF_Authorization\n', Cookies.get('CF_Authorization')))
			)
			.subscribe();
	}

	whenUserUnathorizedByCloudflareRedirectToCloudflareLoginPage(): void {
		timer(1000 * 60 * 2)
			.subscribe(() => this.checkAccessAndTryRedirectToCFLogin());
	}

	async checkAccessAndTryRedirectToCFLogin(): Promise<void> {
		try {
			const { url } = await this._tryGetCloudflareLoginUrl()
				.toPromise();

			if (url)
				location.href = url;
		} catch (error) {

		}
	}

	private _tryGetCloudflareLoginUrl(): Observable<{ url?: string; }> {
		return this._http
			.get(`/${ CLOUDFLARE_ACCESS_CHECK_PATHNAME }?cache-bust=${ uniqId() }&${ BYPASS_AUTH_CHECK }`);
	}
}
