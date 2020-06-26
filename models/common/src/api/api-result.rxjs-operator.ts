import { reportJsErrorIfAny } from '@bp/shared/rxjs';
import { Action } from '@bp/shared/typings';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { ApiErrorActionPayload, ApiResultActionPayload } from './ngrx-action-payloads';
import { ResponseError } from './response-error';

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
			catchError((apiError: ResponseError) => of(failure({ apiError })))
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
			catchError((apiError: ResponseError) => of(failure({ apiError })))
		);

		return closeNotifier$ ? stream$.pipe(takeUntil(closeNotifier$)) : stream$;
	};
}
