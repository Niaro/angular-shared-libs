import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, startWith, first, switchMap } from 'rxjs/operators';
import { LocalStorageService } from 'angular-2-local-storage';
import { Dictionary } from 'lodash';

import { environment } from '@bp/environment';

export const CORRELATION_ID_KEY = 'x-correlation-id';
const MOCK_RESPONSE_CODE = 'x-mock-response-code';
const CONTENT_TYPE = 'Content-Type';
const { url: API_URL, version: API_VERSION } = environment.api || { url: '', version: '' };

@Injectable({
	providedIn: 'root',
})
export class ApiDefaultsInterceptorService implements HttpInterceptor {
	private static instance;

	headers: Dictionary<string> = {
		[CONTENT_TYPE]: 'application/json',
		'json-naming-strategy': 'camelcase',
		'x-api-key': environment.mockKey,
		[MOCK_RESPONSE_CODE]: '200'
	};
	checkAuthorization = false;

	baseUrl = `${API_URL ? (API_URL.includes('api') ? API_URL : `${API_URL}/api`) : '/api'}${API_VERSION ? `/${API_VERSION}` : ''}`;

	private authorized$ = new BehaviorSubject(false);

	constructor(private localStorage: LocalStorageService) {
		if (ApiDefaultsInterceptorService.instance)
			return ApiDefaultsInterceptorService.instance;

		environment.dev && this.initMockResponseCodeHook();

		return ApiDefaultsInterceptorService.instance = this;
	}

	authorized(token: string | null): void {
		this.headers.Authorization = token ? `Bearer ${token}` : '';
		this.authorized$.next(!!token);
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return !this.checkAuthorization || request.url.includes('auth')
			? this.enhanceRequest(request, next)
			: this.authorized$.pipe(
				filter(it => !!it),
				first(),
				switchMap(() => this.enhanceRequest(request, next))
			);
	}

	private enhanceRequest(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		const url = request.url.startsWith('http') || request.url.includes('assets')
			? request.url
			: `${this.baseUrl}/${request.url}`;
		return next.handle(request.clone({
			url,
			setHeaders: {
				...(request.url.startsWith('http') ? {} : this.headers),
				[CONTENT_TYPE]: request.headers.get(CONTENT_TYPE) || this.headers[CONTENT_TYPE],
			},
		}));
	}

	private initMockResponseCodeHook() {
		this.localStorage.setItems$
			.pipe(
				filter(e => e.key === MOCK_RESPONSE_CODE),
				startWith({
					key: MOCK_RESPONSE_CODE,
					newvalue: this.localStorage.get<string>(MOCK_RESPONSE_CODE),
				})
			)
			.subscribe(e => (this.headers[e.key] = e.newvalue ? e.newvalue : '200'));

		Object.defineProperty(window, 'bpMockResponseCode', {
			get: () => this.localStorage.get(MOCK_RESPONSE_CODE),
			set: (value: string) => this.localStorage.set(MOCK_RESPONSE_CODE, value),
		});
	}
}
