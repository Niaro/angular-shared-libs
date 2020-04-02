import { Injectable, ErrorHandler } from '@angular/core';
import * as LogRocket from 'logrocket';
import createNgrxMiddleware from 'logrocket-ngrx';

import { environment as env } from '@bp/environment';

import { initLogrocketIfOnRemoteServer } from './logrocket';

initLogrocketIfOnRemoteServer();

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

	static captureMessage(msg: string, dataToLog?: any) {
		dataToLog && console.log(dataToLog);

		if (env.remoteServer)
			LogRocket.captureMessage(
				msg,
				{ tags: { source: 'code' } }
			);
		else
			console.warn(msg);
	}

	constructor() {
		if (TelemetryService.instance)
			return TelemetryService.instance;

		return TelemetryService.instance = this;
	}

	getUserLogrocketUrl(userId: string) {
		return `https://app.logrocket.com/${ env.logrocket }/sessions?u=${ userId }`;
	}

	getSessionUrl(): Promise<string> {
		return new Promise(resolve => LogRocket.getSessionURL(v => resolve(v)));
	}

	registerUser(uid: string, userTraits?: Dictionary<string | number | boolean | null | undefined>) {
		LogRocket.identify(uid, userTraits as any);
	}

	captureMessage(msg: string, dataToLog?: any) {
		TelemetryService.captureMessage(msg, dataToLog);
	}

	captureError(error: any) {
		TelemetryService.captureError(error, 'code');
	}
}

export class AppErrorHandler implements ErrorHandler {
	handleError(error: any) {
		TelemetryService.appErrorHandler(error);
	}
}
