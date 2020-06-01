import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { EnvironmentService } from '../environment.service';


export const BYPASS_AUTH_CHECK = 'bypass-auth-check';

export const CORRELATION_ID_KEY = 'x-correlation-id';

export const CONTENT_TYPE = 'Content-Type';

@Injectable({ providedIn: 'root' })
export class HttpConfigService {

	private readonly _apiUrlMainPart = `${ this._env.api.url
		? (this._env.api.url.includes('api') ? this._env.api.url : `${ this._env.api.url }/api`)
		: '/api' }`;

	private readonly _apiUrlVersionPart = `${ this._env.api.version ? `/${ this._env.api.version }` : '' }`;

	readonly baseApiUrl = `${ this._apiUrlMainPart }${ this._apiUrlVersionPart }`;

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

	private _authorized$ = new BehaviorSubject(false);
	firstAuthorization$ = this._authorized$.pipe(first(v => !!v));

	constructor(private _env: EnvironmentService) { }

	setAuthorizationHeader(token: string): void {
		this.headers.Authorization = `Bearer ${ token }`;
		this._authorized$.next(true);
	}

	removeAuthorizationHeader() {
		this.headers.Authorization = '';
		this._authorized$.next(false);
	}
}
