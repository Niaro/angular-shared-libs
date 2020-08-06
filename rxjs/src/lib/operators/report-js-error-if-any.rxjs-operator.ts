import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function reportJsErrorIfAny<T>(source$: Observable<T>) {
	return source$.pipe(
		catchError(error => {
			if (error instanceof Error)
				console.error(error);

			return throwError(error);
		})
	);
}
