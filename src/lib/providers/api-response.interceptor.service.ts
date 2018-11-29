import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResponseError, IApiResponse } from '../models';

@Injectable()
export class ApiResponseInterceptorService implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return next.handle(req).pipe(
			map((e: HttpEvent<IApiResponse<any>>) => e instanceof HttpResponse
				? e.clone({ body: e.body.result })
				: e
			),
			catchError((e: HttpErrorResponse) => throwError(new ResponseError(e)))
		);
	}
}
