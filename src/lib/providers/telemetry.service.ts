import { Injectable } from '@angular/core';
import { Dictionary } from 'lodash';
import * as LogRocket from 'logrocket';
import createNgrxMiddleware from 'logrocket-ngrx';

import { environment } from '@bp/environment';

if (environment.prod && location.hostname !== 'localhost' && environment.logrocket) {
	LogRocket.init(environment.logrocket, {
		release: `${environment.version}`,
		console: {
			shouldAggregateConsoleErrors: true,
		},
		network: {
			requestSanitizer: (request: { url: string, body: any, headers: Dictionary<string> }) => {
				// if the url contains 'ignore'
				if (request.url.toLowerCase().includes('deposit'))
					// scrub out the body
					request.body = null;

				request.headers['Authorization'] = null;
				return request;
			},
		},
	});
}

@Injectable({
	providedIn: 'root'
})
export class TelemetryService {

	static logrocketMetaReducer = createNgrxMiddleware(LogRocket);

	private static instance: TelemetryService;

	static routerErrorHandler(error) {
		environment.dev && console.error(error);
		LogRocket.captureMessage(error, { tags: { source: 'router' } });
	}

	constructor() {
		if (TelemetryService.instance)
			return TelemetryService.instance;

		return TelemetryService.instance = this;
	}

	registerUser(uid: string, email: string) {
		LogRocket.identify(uid, { email });
	}
}
