import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

import { ResponseError } from '../response-error';
import { StatusCode } from '../status-code';

export const retryOn5XXErrorWithScalingDelay = ({
	maxRetryAttempts = 5,
	scalingDelayDuration = 1000
}: {
	maxRetryAttempts?: number;
	scalingDelayDuration?: number;
} = {}) => <T>(source$: Observable<T>) => source$.pipe(
	retryWhen(attempts$ => attempts$.pipe(mergeMap((error: ResponseError, i) => {
		const retryAttempt = i + 1;
		const needRetry = [ StatusCode.InternalServerError, StatusCode.UnknownError ].includes(error.status!)
			&& retryAttempt <= maxRetryAttempts;

		return needRetry
			? timer(retryAttempt * scalingDelayDuration)
			: throwError(error);
	})))
);
