import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';
import { LocalStorageService } from 'angular-2-local-storage';

import { environment } from '@bp/environment';
import { IdentityFacade } from '../identity';

const MOCK_RESPONSE_CODE = 'x-mock-response-code';
const CONTENT_TYPE = 'Content-Type';

@Injectable({
	providedIn: 'root',
})
export class ApiDefaultsInterceptorService implements HttpInterceptor {

	private headers: { [key: string]: string } = {
		[CONTENT_TYPE]        : 'application/json',
		'json-naming-strategy': 'camelcase',
		'x-api-key'           : environment.mockKey,
		[MOCK_RESPONSE_CODE]  : '200'
	};

	constructor(private localStorage: LocalStorageService, private identity: IdentityFacade) {
		environment.dev && this.initMockResponseCodeHook();
		this.identity.user$.subscribe(it => this.headers.Authorization = it ? `Bearer ${it.token}` : '');
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return next.handle(request.clone({
			url: request.url.startsWith('http')
				? request.url
				// tslint:disable-next-line:max-line-length
				: `${environment.api ? environment.api.url : ''}/api${environment.api && environment.api.version ? '/' + environment.api.version : ''}/${request.url}`,
			setHeaders: {
				...this.headers,
				[CONTENT_TYPE]: request.headers.get(CONTENT_TYPE) || this.headers[CONTENT_TYPE],
			},
		}));
	}

	private initMockResponseCodeHook() {
		this.localStorage.setItems$
			.pipe(
				filter(e => e.key === MOCK_RESPONSE_CODE),
				startWith({
					key     : MOCK_RESPONSE_CODE,
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
