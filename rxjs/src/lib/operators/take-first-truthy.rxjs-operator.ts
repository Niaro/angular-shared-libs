import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

export function takeFirstTruthy<T>(source$: Observable<T | null | undefined>): Observable<NonNullable<T>> {
	return <Observable<NonNullable<T>>> <unknown> source$.pipe(
		first(v => !!v)
	);
}
