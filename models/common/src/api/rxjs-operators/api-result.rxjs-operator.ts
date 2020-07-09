import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { TypedAction } from '@ngrx/store/src/models';

import { reportJsErrorIfAny } from '@bp/shared/rxjs';
import { Action } from '@bp/shared/typings';

import { ApiErrorActionPayload, ApiResultActionPayload } from '../ngrx-action-payloads';
import { ResponseError } from '../response-error';

export function apiResult<T>(
	success: Action<ApiResultActionPayload<T>>,
	failure: Action<ApiErrorActionPayload>,
	closeNotifier$?: Observable<any>
): OperatorFunction<T | null, (ApiResultActionPayload<T> | ApiErrorActionPayload) & TypedAction<string>> {
	return (source$: Observable<T | null>) => {
		const stream$ = source$.pipe(
			map(result => result
				? success({ result: result! })
				: failure({ apiError: ResponseError.notFound })
			),
			reportJsErrorIfAny,
			catchError((error: ResponseError | Error) => of(failure({ apiError: new ResponseError(error) })))
		);

		return closeNotifier$ ? stream$.pipe(takeUntil(closeNotifier$)) : stream$;
	};
}

export function apiVoidResult<T>(
	success: Action,
	failure: Action<ApiErrorActionPayload>,
	closeNotifier$?: Observable<any>
): OperatorFunction<T, ({} | ApiErrorActionPayload) & TypedAction<string>> {
	return (source$: Observable<T>) => {
		const stream$ = source$.pipe(
			map(success),
			reportJsErrorIfAny,
			catchError((error: ResponseError | Error) => of(failure({ apiError: new ResponseError(error) })))
		);

		return closeNotifier$ ? stream$.pipe(takeUntil(closeNotifier$)) : stream$;
	};
}
