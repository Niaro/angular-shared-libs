import { isMap, isObject, mapValues } from 'lodash-es';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { transformMapToObject } from '@bp/shared/utilities';

import { BYPASS_AUTH_CHECK, CONTENT_TYPE, HttpConfigService } from './http-config.service';

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
			body: this._digestBody(request.body),
			url: this._shouldPrependBackendBaseSegmentToHttpRequestUrl(request)
				? `${ this._httpConfig.backendBaseSegment }/${ request.url }`
				: request.url,
			setHeaders: {
				...(request.url.startsWith('http') ? {} : this._httpConfig.headers),
				[ CONTENT_TYPE ]: request.headers.get(CONTENT_TYPE) || this._httpConfig.headers[ CONTENT_TYPE ] || '',
			},
		}));
	}

	private _digestBody(body: any): any {
		if (!isObject(body))
			return body;

		if (isMap(body))
			return transformMapToObject(body);

		return mapValues(body, v => isMap(v) ? transformMapToObject(v) : v);
	}

	private _shouldPrependBackendBaseSegmentToHttpRequestUrl(request: HttpRequest<any>) {
		return !request.url.startsWith('http')
			&& !request.url.includes('assets') // all assets is relative to the origin
			&& !request.url.startsWith('/');
	}
}
