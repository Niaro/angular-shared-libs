import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { isPresent } from '@bp/shared/utilities';

export function takeFirstPresent<T>(source$: Observable<T | null | undefined>): Observable<NonNullable<T>> {
	return <Observable<NonNullable<T>>> <unknown> source$.pipe(
		first(isPresent)
	);
}
