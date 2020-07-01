import Cookies from 'js-cookie';
import { Observable, timer } from 'rxjs';
import { mergeMapTo, tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { uniqId } from '@bp/shared/utilities';

import { BYPASS_AUTH_CHECK } from './http';

export const SKIP_CLOUDFLARE_ACCESS_CHECK = 'skip-cloudflare-access-check';

export const CLOUDFLARE_ACCESS_CHECK_PATHNAME = 'cf-access-check';

if (location.href.includes('cdn-cgi/access/authorized'))
	location.href = `${ location.origin }/index.html?ngsw-bypass`;

@Injectable({
	providedIn: 'root'
})
export class CloudflareAccessService {

	private _beforeRedirectHook?: () => void;

	constructor(private _http: HttpClient) {

		timer(0, 1000 * 30)
			.pipe(
				mergeMapTo(this._tryGetCloudflareLoginUrl()),
				tap(() => console.warn('CF_Authorization\n', Cookies.get('CF_Authorization')))
			)
			.subscribe(() => {
				// if (location.href.includes('cdn-cgi/access/authorized'))
				// 	location.pathname = `${ location.origin }/index.html?ngsw-bypass`;
			});
	}

	whenUserUnathorizedByCloudflareRedirectToCloudflareLoginPage(
		{ beforeRedirectHook }: { beforeRedirectHook?(): void; } = {}
	): void {
		this._beforeRedirectHook = beforeRedirectHook;

		timer(1000 * 60 * 2)
			.subscribe(() => this.checkAccessAndTryRedirectToCFLogin());
	}

	async checkAccessAndTryRedirectToCFLogin(): Promise<void> {
		try {
			const { url } = await this._tryGetCloudflareLoginUrl()
				.toPromise();

			if (url) {
				this._beforeRedirectHook && this._beforeRedirectHook();
				location.href = url;
			}
		} catch (error) {

		}
	}

	private _tryGetCloudflareLoginUrl(): Observable<{ url?: string; }> {
		return this._http
			.get(`/${ CLOUDFLARE_ACCESS_CHECK_PATHNAME }?cache-bust=${ uniqId() }&${ BYPASS_AUTH_CHECK }`);
	}
}
