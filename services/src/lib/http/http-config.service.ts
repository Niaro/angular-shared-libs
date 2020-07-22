import { LocalStorageService } from 'angular-2-local-storage';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { EnvironmentService } from '../environment.service';

export const BYPASS_AUTH_CHECK = 'bypass-auth-check';

export const CORRELATION_ID_KEY = 'x-correlation-id';

export const CONTENT_TYPE = 'Content-Type';

const USE_BACKEND_LOCALHOST_KEY = 'use-backend-localhost-key';

@Injectable({ providedIn: 'root' })
export class HttpConfigService {

	private readonly _backendEndpointBaseSegment = `${ this._env.api.url
		? (this._env.api.url.includes('api') ? this._env.api.url : `${ this._env.api.url }/api`)
		: '/api' }`;

	private readonly _backendEndpointVersionSegment = `${ this._env.api.version ? `/${ this._env.api.version }` : '' }`;

	private _backendLocalhost = `http://localhost:5000/api${ this._backendEndpointVersionSegment }`;

	private readonly _useBackendLocalhost$ = new BehaviorSubject(!!this._localStorage.get(USE_BACKEND_LOCALHOST_KEY));
	useBackendLocalhost$ = this._useBackendLocalhost$.asObservable();
	get useBackendLocalhost() { return this._useBackendLocalhost$.value; }

	get backendBaseSegment(): string {
		return this._useBackendLocalhost$.value
			? this._backendLocalhost
			: `${ this._backendEndpointBaseSegment }${ this._backendEndpointVersionSegment }`;
	}

	readonly headers: { [ key: string ]: string | null; } = {
		[ CONTENT_TYPE ]: 'application/json',
		'json-naming-strategy': 'camelcase',
		// all the api calls should bypass the service worker since due to cloudlflare we sometimes have the 302
		// response code which if handled by the browser redirects the page, but with the service worker used as proxy for the api calls
		// it doesn't happen
		'ngsw-bypass': '',
		// for cloudflare access https://developers.cloudflare.com/access/faq/
		credentials: 'same-origin'
	};

	private readonly _authorized$ = new BehaviorSubject(false);

	readonly firstAuthorization$ = this._authorized$.pipe(first(v => !!v));

	constructor(
		private _env: EnvironmentService,
		private _localStorage: LocalStorageService
	) {
		(<any> window).BP_HTTP_CONFIG = this;
	}

	setAuthorizationHeader(token: string): void {
		this.headers.Authorization = `Bearer ${ token }`;
		this._authorized$.next(true);
	}

	removeAuthorizationHeader(): void {
		this.headers.Authorization = '';
		this._authorized$.next(false);
	}

	acceptLanguage(lang: string): void {
		this.headers[ 'Accept-Language' ] = lang;
	}

	toggleBackendLocalhost(): void {
		this._useBackendLocalhost$.next(!this._useBackendLocalhost$.value);
		this._localStorage.set(USE_BACKEND_LOCALHOST_KEY, this._useBackendLocalhost$.value);
	}
}
