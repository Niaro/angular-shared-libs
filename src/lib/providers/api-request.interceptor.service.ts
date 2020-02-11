import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';

import { environment } from '@bp/environment';

export const BYPASS_INTERCEPTOR = 'bypass-interceptor';
export const CORRELATION_ID_KEY = 'x-correlation-id';
const CONTENT_TYPE = 'Content-Type';
const { url: API_URL, version: API_VERSION } = environment.api || { url: '', version: '' };

@Injectable({
	providedIn: 'root',
})
export class ApiRequestInterceptorService implements HttpInterceptor {
	private static instance: ApiRequestInterceptorService;

	headers: Dictionary<string | null> = {
		[CONTENT_TYPE]: 'application/json',
		'json-naming-strategy': 'camelcase',
		// all the api calls should bypass the service worker since due to cloudlflare we sometimes have the 302
		// response code which if handled by the browser redirects the page, but with the service worker used as proxy for the api calls
		// it doesn't happpen
		'ngsw-bypass': '',
		// for cloudlfare access https://developers.cloudflare.com/access/faq/
		'credentials': 'same-origin'
	};

	private _shouldWaitForAuthorizationToken = false;

	baseUrl = `${API_URL ? (API_URL.includes('api') ? API_URL : `${API_URL}/api`) : '/api'}${API_VERSION ? `/${API_VERSION}` : ''}`;

	private authorized$ = new BehaviorSubject(false);

	constructor() {
		if (ApiRequestInterceptorService.instance)
			return ApiRequestInterceptorService.instance;

		return ApiRequestInterceptorService.instance = this;
	}

	waitForAuthorizationTokenOnXHRs() {
		this._shouldWaitForAuthorizationToken = true;
	}

	authorized(token: string | null | undefined): void {
		this.headers.Authorization = token ? `Bearer ${token}` : '';
		this.authorized$.next(!!token);
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return this._checkShouldWaitForAuthorizationToken(request)
			? this.authorized$.pipe(
				filter(it => !!it),
				first(),
				switchMap(() => this.enhanceRequest(request, next))
			)
			: this.enhanceRequest(request, next);
	}

	private _checkShouldWaitForAuthorizationToken(request: HttpRequest<any>) {
		return !request.url.includes('auth')
			&& !request.url.includes(BYPASS_INTERCEPTOR)
			&& this._shouldWaitForAuthorizationToken;
	}

	private enhanceRequest(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return next.handle(request.clone({
			url: this._shouldIncludeBaseHrefIntoXHRUrl(request)
				? `${this.baseUrl}/${request.url}`
				: request.url,
			setHeaders: {
				...(request.url.startsWith('http') ? {} : this.headers),
				[CONTENT_TYPE]: request.headers.get(CONTENT_TYPE) || this.headers[CONTENT_TYPE] || '',
			},
		}));
	}

	private _shouldIncludeBaseHrefIntoXHRUrl(request: HttpRequest<any>) {
		return !request.url.startsWith('http')
			&& !request.url.includes('assets')
			&& !request.url.includes(BYPASS_INTERCEPTOR);
	}
}
