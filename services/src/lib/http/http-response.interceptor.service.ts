import {
	HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest,
	HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse, ResponseError, StatusCode } from '@bp/shared/models/common';
import { fromPairs, isNil } from 'lodash-es';
import { defer, iif, Observable, throwError } from 'rxjs';
import { catchError, flatMap, map, tap } from 'rxjs/operators';
import { RouterService } from '../router.service';
import { TelemetryService } from '../telemetry';
import { CORRELATION_ID_KEY, HttpConfigService } from './http-config.service';

export const DO_NOT_REDIRECT_ON_500X = 'do-not-redirect-on-500x';

@Injectable()
export class HttpResponseInterceptorService implements HttpInterceptor {

	constructor(
		private _router: RouterService,
		private _httpConfig: HttpConfigService,
		private _telemetry: TelemetryService
	) { }

	saveCorrelationIdFromResponseForNextRequests = (e: HttpEvent<any>) => {
		if (e instanceof HttpResponse && e.headers.has(CORRELATION_ID_KEY))
			this._httpConfig.headers[ CORRELATION_ID_KEY ] = e.headers.get(CORRELATION_ID_KEY);
	};

	normalizeApiResponse = (e: HttpEvent<IApiResponse<any>>) => e instanceof HttpResponse && e.body?.result
		? e.clone({ body: e.body.result })
		: e;

	parseHttpErrorResponseIntoResponseError = (httpError: HttpErrorResponse) => iif(
		() => httpError.error instanceof Blob,
		defer(async () => new ResponseError(JSON.parse(
			await (new Response(httpError.error)).text())
		)),
		defer(() => [ new ResponseError(httpError) ])
	)
		// tslint:disable-next-line: no-unnecessary-callback-wrapper
		.pipe(flatMap(v => throwError(v)));

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return next
			.handle(req.clone({
				params: this._cleanseParams(req.params)
			}))
			.pipe(
				tap(this.saveCorrelationIdFromResponseForNextRequests),
				map(this.normalizeApiResponse),
				catchError(this.parseHttpErrorResponseIntoResponseError),
				catchError((error: ResponseError) => {
					this._whenRateLimitedLogIt(error);
					this._whenNotHandledNavigateToApiErrorPage(error);

					return throwError(error);
				}));
	}

	private _cleanseParams(params: HttpParams) {
		const keys = params instanceof HttpParams ? params.keys() : Object.keys(params);
		const getValueByKey = (k: string) => params instanceof HttpParams ? params.get(k) : params[ k ];

		return new HttpParams({
			fromObject: fromPairs(
				keys
					.map(k => [ k, getValueByKey(k) ])
					.map(([ k, v ]) => [ k, isNil(v) ? v : v.toString() ])
					.filter(([ , v ]) => v !== '' && v !== 'NaN' && !isNil(v))
			)
		});
	}

	private _whenNotHandledNavigateToApiErrorPage(error: ResponseError) {
		if (!error.url || !error.url.includes(DO_NOT_REDIRECT_ON_500X))
			this._router.tryNavigateOnResponseError(error);
	}

	private _whenRateLimitedLogIt(error: ResponseError) {
		if (error.status === StatusCode.RateLimited)
			this._telemetry.captureMessage(error.statusText!);
	}
}
