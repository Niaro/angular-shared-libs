import { ErrorHandler, Injectable } from '@angular/core';
import { Dictionary, IEnvironment } from '@bp/shared/typings';
import { MetaReducer } from '@ngrx/store';
import { of } from 'rxjs';
import { LogRocketReporter } from './logrocket.reporter';
import { IReporter } from './reporter.interface';

@Injectable({
	providedIn: 'root'
})
export class TelemetryService implements IReporter {

	static logMetaReducer: MetaReducer | null;

	private static _instance: TelemetryService;

	private static _env: IEnvironment;

	private static _reporter: IReporter | null;

	static init(env: IEnvironment) {
		TelemetryService._env = env;
		TelemetryService._reporter = env.logrocket
			? new LogRocketReporter(
				env.logrocket,
				env.name,
				env.name === 'prod' ? env.version.release : env.version.releaseWithBuild
			)
			: null;
		TelemetryService.logMetaReducer = TelemetryService._reporter?.logMetaReducer ?? null;
	}

	static captureError(error: Error | any, source: string) {
		TelemetryService._env.localServer && console.error(error);
		TelemetryService._reporter?.captureError(error, source);
	}

	static captureMessage(msg: string, dataToLog?: any) {
		msg = `[log]: ${ msg }`;
		TelemetryService._reporter?.captureMessage(msg);
		TelemetryService._env.localServer && console.warn(msg);
		dataToLog && console.warn(dataToLog);
	}

	static routerErrorHandler(error: any) {
		TelemetryService.captureError(error, 'router');
	}

	static appErrorHandler(error: any) {
		TelemetryService.captureError(error, 'app');
	}

	static log(message?: any, ...optionalParams: any[]) {
		TelemetryService._reporter?.log(message, ...optionalParams);
		TelemetryService._env.localServer && console.warn(message, ...optionalParams);
	}

	static warn(message?: any, ...optionalParams: any[]) {
		TelemetryService._reporter?.warn(message, ...optionalParams);
		TelemetryService._env.localServer && console.warn(message, ...optionalParams);
	}

	private _reporter = TelemetryService._reporter;

	get enabled() { return !!this._reporter; }

	currentSessionUrl$ = this._reporter?.currentSessionUrl$ ?? of(null);

	logMetaReducer = this._reporter?.logMetaReducer ?? null;

	constructor() {
		if (TelemetryService._instance)
			return TelemetryService._instance;

		return TelemetryService._instance = this;
	}

	identifyUser(uid: string, userTraits?: Dictionary<string | number | boolean | null | undefined>) {
		this._reporter?.identifyUser(uid, userTraits);
	}

	getUrlForUserSessions(userId: string): string | null {
		return this._reporter?.getUrlForUserSessions(userId) ?? null;
	}

	captureError(error: any) {
		TelemetryService.captureError(error, 'manual');
	}

	captureMessage(msg: string, dataToLog?: any) {
		TelemetryService.captureMessage(msg, dataToLog);
	}

	warn(message?: any, ...optionalParams: any[]) {
		TelemetryService.warn(message, ...optionalParams);
	}

	log(message?: any, ...optionalParams: any[]) {
		TelemetryService.log(message, ...optionalParams);
	}

}

export class AppErrorHandler implements ErrorHandler {
	handleError(error: any) {
		TelemetryService.appErrorHandler(error);
	}
}
