import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isNil } from 'lodash-es';

import { ResponseError, IApiResponse } from '../models';
import { chain } from '../utils';
import { RouterService } from './router.service';
import { ApiDefaultsInterceptorService, CORRELATION_ID_KEY } from './api-defaults.interceptor.service';

@Injectable()
export class ApiResponseInterceptorService implements HttpInterceptor {

	constructor(
		private router: RouterService,
		private apiDefaultsInterceptor: ApiDefaultsInterceptorService
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
							this.apiDefaultsInterceptor.headers[CORRELATION_ID_KEY] = e.headers.get(CORRELATION_ID_KEY);
						return e.clone({ body: e.body && e.body.result });
					} else
						return e;
				}),
				catchError((e: HttpErrorResponse) => {
					const error = new ResponseError(e);
					this.router.tryNavigateOnResponseError(error);
					return throwError(error);
				})
			);
	}

	private cleanseParams(params: HttpParams) {
		return new HttpParams({
			fromObject: chain(params.keys())
				.map((k) => [k, params.get(k) as any])
				.map(([k, v]) => [k, isNil(v) ? v : v.toString()])
				.filter(([, v]) => v !== '' && v !== 'NaN' && !isNil(v))
				.fromPairs()
				.value()
		});
	}
}
