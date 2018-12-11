import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResponseError, IApiResponse } from '../models';
import { RouterService } from './router.service';

@Injectable()
export class ApiResponseInterceptorService implements HttpInterceptor {

	constructor(private router: RouterService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return next.handle(req).pipe(
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
}
