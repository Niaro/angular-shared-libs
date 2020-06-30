import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

export const retryWithScalingDelay = ({
	maxRetryAttempts = 5,
	scalingDelayDuration = 1000
}: {
	maxRetryAttempts?: number;
	scalingDelayDuration?: number;
} = {}) => (source$: Observable<any>) => source$.pipe(
	retryWhen(attempts$ => attempts$.pipe(mergeMap((error, i) => {
		const retryAttempt = i + 1;

		return retryAttempt <= maxRetryAttempts
			? timer(retryAttempt * scalingDelayDuration)
			: throwError(error);
	})))
);
