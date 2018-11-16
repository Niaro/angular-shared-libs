import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';
import { LocalStorageService } from 'angular-2-local-storage';

import { environment } from '@environment';
import { MOCK_KEY } from '@constants';

const MOCK_RESPONSE_CODE = 'x-mock-response-code';
const CONTENT_TYPE = 'Content-Type';

@Injectable({
	providedIn: 'root',
})
export class ApiDefaultsInterceptorService implements HttpInterceptor {
	get bearerToken() {
		return this['_token_'];
	}
	set bearerToken(value: string) {
		this['_token_'] = value;
		this.headers['Authorization'] = `Bearer ${value}`;
	}

	private headers = {
		[CONTENT_TYPE]: 'application/json',
		'x-api-key': MOCK_KEY,
		[MOCK_RESPONSE_CODE]: '200',
	};

	constructor(private localStorage: LocalStorageService) {
		environment.dev && this.initMockResponseCodeHook();
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		console.warn('default contenttype', request.headers.get(CONTENT_TYPE));

		return next.handle(
			request.clone({
				url: request.url.startsWith('http')
					? request.url
					: `${environment.api.url}${environment.api.version}/${request.url}`,
				setHeaders: {
					...this.headers,
					[CONTENT_TYPE]: request.headers.get(CONTENT_TYPE) || this.headers[CONTENT_TYPE],
				},
			})
		);
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
