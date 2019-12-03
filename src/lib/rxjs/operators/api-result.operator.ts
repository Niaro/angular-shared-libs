import { Observable, OperatorFunction, of } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';
import { TypedAction } from '@ngrx/store/src/models';

import { Action, ResponseError } from '../../models';

export function apiResult<T>(
	success: Action<{ result: T }>,
	failure: Action<{ apiError: ResponseError }>,
	closeNotifier: Observable<any>
): OperatorFunction<T, ({ result: T; } | { apiError: ResponseError }) & TypedAction<string>> {
	return (source: Observable<T>) => {
		const stream = source.pipe(
			map(result => success({ result })),
			catchError((apiError: ResponseError) => of(failure({ apiError })))
		);
		return closeNotifier ? stream.pipe(takeUntil(closeNotifier)) : stream;
	};
}

export function apiVoidResult<T>(
	success: Action,
	failure: Action<{ apiError: ResponseError }>,
	closeNotifier?: Observable<any>
): OperatorFunction<T, ({} | { apiError: ResponseError }) & TypedAction<string>> {
	return (source: Observable<T>) => {
		const stream = source.pipe(
			map(() => success()),
			catchError((apiError: ResponseError) => of(failure({ apiError })))
		);
		return closeNotifier ? stream.pipe(takeUntil(closeNotifier)) : stream;
	};
}
