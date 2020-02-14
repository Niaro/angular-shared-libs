import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HttpConfigService, CONTENT_TYPE, BYPASS_INTERCEPTOR } from './http-config.service';

@Injectable()
export class ApiRequestInterceptorService implements HttpInterceptor {

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
			&& !request.url.includes(BYPASS_INTERCEPTOR)
			&& this._httpConfig.shouldWaitForAuthorizationToken;
	}

	private _enhanceRequest(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return next.handle(request.clone({
			url: this._shouldIncludeBaseHrefIntoXHRUrl(request)
				? `${this._httpConfig.baseUrl}/${request.url}`
				: request.url,
			setHeaders: {
				...(request.url.startsWith('http') ? {} : this._httpConfig.headers),
				[CONTENT_TYPE]: request.headers.get(CONTENT_TYPE) || this._httpConfig.headers[CONTENT_TYPE] || '',
			},
		}));
	}

	private _shouldIncludeBaseHrefIntoXHRUrl(request: HttpRequest<any>) {
		return !request.url.startsWith('http')
			&& !request.url.includes('assets')
			&& !request.url.includes(BYPASS_INTERCEPTOR);
	}
}
