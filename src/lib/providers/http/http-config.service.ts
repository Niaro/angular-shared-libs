import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { environment } from '@bp/environment';

export const BYPASS_INTERCEPTOR = 'bypass-interceptor';
export const CORRELATION_ID_KEY = 'x-correlation-id';
export const CONTENT_TYPE = 'Content-Type';

const { url: API_URL, version: API_VERSION } = environment.api || { url: '', version: '' };

@Injectable({
	providedIn: 'root',

})
export class HttpConfigService {
	readonly baseUrl = `${ API_URL ? (API_URL.includes('api') ? API_URL : `${ API_URL }/api`) : '/api' }${ API_VERSION ? `/${ API_VERSION }` : '' }`;

	headers: { [ key: string ]: string | null; } = {
		[ CONTENT_TYPE ]: 'application/json',
		'json-naming-strategy': 'camelcase',
		// all the api calls should bypass the service worker since due to cloudlflare we sometimes have the 302
		// response code which if handled by the browser redirects the page, but with the service worker used as proxy for the api calls
		// it doesn't happen
		'ngsw-bypass': '',
		// for cloudflare access https://developers.cloudflare.com/access/faq/
		'credentials': 'same-origin'
	};

	private _shouldWaitForAuthorizationToken = false;
	get shouldWaitForAuthorizationToken() { return this._shouldWaitForAuthorizationToken; }

	private _authorized$ = new BehaviorSubject(false);
	firstAuthorization$ = this._authorized$.pipe(
		filter(v => !!v),
		first()
	);

	waitForAuthorizationTokenOnXHRs() {
		this._shouldWaitForAuthorizationToken = true;
	}

	authorize(token: string): void {
		this.headers.Authorization = `Bearer ${ token }`;
		this._authorized$.next(true);
	}

	resetAuthorization() {
		this.headers.Authorization = '';
		this._authorized$.next(false);
	}
}
