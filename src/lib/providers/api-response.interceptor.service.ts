import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isNil } from 'lodash-es';

import { ResponseError, IApiResponse } from '../models';
import { RouterService } from './router.service';
import { chain } from '../utils';

@Injectable()
export class ApiResponseInterceptorService implements HttpInterceptor {

	constructor(private router: RouterService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return next
			.handle(req.clone({
				params: this.cleanseParams(req.params)
			}))
			.pipe(
				map((e: HttpEvent<IApiResponse<any>>) => e instanceof HttpResponse
					? e.clone({ body: e.body.result })
					: e
				),
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
