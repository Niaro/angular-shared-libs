import { Injectable, ErrorHandler } from '@angular/core';
import { Dictionary } from 'lodash';
import * as LogRocket from 'logrocket';
import createNgrxMiddleware from 'logrocket-ngrx';

import { environment as env } from '@bp/environment';

if (env.remoteServer && location.hostname !== 'localhost' && env.logrocket) {
	LogRocket.init(env.logrocket, {
		release: env.name === 'prod' && !location.hostname.includes('demostand')
			? env.version.release
			: env.version.prerelease,
		console: {
			shouldAggregateConsoleErrors: true,
		},
		network: {
			requestSanitizer: (request: { url: string, body: any, headers: Dictionary<string | undefined>; }) => {
				// if the url contains 'ignore'
				if (request.url.toLowerCase().includes('deposit'))
					// scrub out the body
					request.body = undefined;

				request.headers['Authorization'] = undefined;
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

	static routerErrorHandler(error: any) {
		TelemetryService.captureError(error, 'router');
	}

	static appErrorHandler(error: any) {
		TelemetryService.captureError(error, 'app');
	}

	static captureError(error: Error | any, source: string) {
		if (env.remoteServer)
			LogRocket.captureException(
				error instanceof Error ? error : new Error(JSON.stringify(error)),
				{ tags: { source } }
			);
		else
			console.error(error);
	}

	constructor() {
		if (TelemetryService.instance)
			return TelemetryService.instance;

		return TelemetryService.instance = this;
	}

	registerUser(uid: string, userTraits: Dictionary<string | number | boolean| null>) {
		LogRocket.identify(uid, userTraits as any);
	}

	captureError(error: any) {
		TelemetryService.captureError(error, 'manual');
	}
}

export class AppErrorHandler implements ErrorHandler {
	handleError(error: any) {
		TelemetryService.appErrorHandler(error);
	}
}
