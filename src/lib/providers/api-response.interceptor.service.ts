import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable, throwError, iif, from, of } from 'rxjs';
import { catchError, map, flatMap } from 'rxjs/operators';
import { isNil, fromPairs } from 'lodash-es';

import { ResponseError, IApiResponse, StatusCode } from '../models';
import { RouterService } from './router.service';
import { ApiRequestInterceptorService, CORRELATION_ID_KEY } from './api-request.interceptor.service';
import { TelemetryService } from './telemetry.service';

@Injectable()
export class ApiResponseInterceptorService implements HttpInterceptor {

	constructor(
		private router: RouterService,
		private apiRequestInterceptor: ApiRequestInterceptorService,
		private _telemetry: TelemetryService
	) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return next
			.handle(req.clone({
				params: this.cleanseParams(req.params)
			}))
			.pipe(
				map((e: HttpEvent<IApiResponse<any>>) => {
					if (e instanceof HttpResponse) {
						if (e.headers.has(CORRELATION_ID_KEY))
							this.apiRequestInterceptor.headers[ CORRELATION_ID_KEY ] = e.headers.get(CORRELATION_ID_KEY);
						return e.body && e.body.result ? e.clone({ body: e.body.result }) : e;
					} else
						return e;
				}),
				catchError((e: HttpErrorResponse) => iif(
					() => e.error instanceof Blob,
					from((new Response(e.error)).text())
						.pipe(map(v => new ResponseError(JSON.parse(v)))),
					of(new ResponseError(e))
				).pipe(flatMap(error => {
					this._whenRateLimitedLogIt(error);
					this._whenNotHandledNavigateToApiErrorPage(error);
					return throwError(error);
				}))
				));
	}

	private cleanseParams(params: HttpParams) {
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
		if (!error.url || !error.url.includes('do-not-redirect-on-500x'))
			this.router.tryNavigateOnResponseError(error);
	}

	private _whenRateLimitedLogIt(error: ResponseError) {
		if (error.status === StatusCode.rateLimited)
			this._telemetry.captureMessage(error.statusText!);
	}
}
