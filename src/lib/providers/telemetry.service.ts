import { Injectable } from '@angular/core';
import { Dictionary } from 'lodash';
import { uniqueId } from 'lodash-es';
import * as LogRocket from 'logrocket';
import createNgrxMiddleware from 'logrocket-ngrx';

import { environment } from '@bp/environment';

if (environment.prod) {
	LogRocket.init('fpkaz5/bgp-admin', {
		release: `${environment.name}_${environment.version}`,
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
		LogRocket.captureMessage(error, { tags: { source: 'router' } });
	}

	constructor() {
		if (TelemetryService.instance)
			return TelemetryService.instance;

		return TelemetryService.instance = this;
	}

	registerUser(email: string) {
		LogRocket.identify(uniqueId(), { email });
	}
}
