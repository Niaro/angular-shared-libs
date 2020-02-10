import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ResponseError } from '@bp/shared/models/api/response-error';
import { TelemetryService } from '@bp/shared/providers/telemetry.service';

export function reportJsErrorIfAny<T>(source: Observable<T>) {
	return source.pipe(
		catchError((error: Error | ResponseError) => {
			if (error instanceof Error)
				TelemetryService.captureError(error, 'reportJsErrorIfAny');
			return throwError(error);
		})
	);
}
