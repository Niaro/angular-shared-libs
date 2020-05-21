import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HttpConfigService, CONTENT_TYPE, BYPASS_AUTH_CHECK } from './http-config.service';

@Injectable()
export class HttpRequestInterceptorService implements HttpInterceptor {

	constructor(private _httpConfig: HttpConfigService) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return this._checkShouldWaitForAuthorizationToken(request)
			? this._httpConfig.firstAuthorization$.pipe(
				switchMap(() => this._enhanceRequest(request, next))
			)
			: this._enhanceRequest(request, next);
	}

	private _checkShouldWaitForAuthorizationToken(request: HttpRequest<any>) {
		return !request.url.includes('auth')
			&& !request.url.includes(BYPASS_AUTH_CHECK);
	}

	private _enhanceRequest(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return next.handle(request.clone({
			url: this._shouldPrependBaseApiUrlToHttpRequestUrl(request)
				? `${ this._httpConfig.baseApiUrl }/${ request.url }`
				: request.url,
			setHeaders: {
				...(request.url.startsWith('http') ? {} : this._httpConfig.headers),
				[ CONTENT_TYPE ]: request.headers.get(CONTENT_TYPE) || this._httpConfig.headers[ CONTENT_TYPE ] || '',
			},
		}));
	}

	private _shouldPrependBaseApiUrlToHttpRequestUrl(request: HttpRequest<any>) {
		return !request.url.startsWith('http')
			&& !request.url.includes('assets'); // all assets is relative to the origin
	}
}
