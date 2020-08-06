import { of } from 'rxjs';

import { ErrorHandler, Injectable } from '@angular/core';

import { MetaReducer } from '@ngrx/store';

import { Dictionary, IEnvironment } from '@bp/shared/typings';

import { HttpConfigService } from '../http/http-config.service';

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

	private static _localLogging: boolean;

	static get localLogging() { return TelemetryService._localLogging; }

	static init(env: IEnvironment) {
		TelemetryService._env = env;
		TelemetryService._localLogging = env.localServer;
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
		if (TelemetryService._localLogging)
			console.error(error);
		else
			TelemetryService._reporter?.captureError(error, source);
	}

	static captureMessage(msg: string, dataToLog?: any) {
		msg = `[log]: ${ msg }`;
		TelemetryService.warn(msg, dataToLog);
		!TelemetryService._localLogging && TelemetryService._reporter?.captureMessage(msg);
	}

	static routerErrorHandler(error: any) {
		TelemetryService.captureError(error, 'router');
	}

	static appErrorHandler(error: any) {
		TelemetryService.captureError(error, 'app');
	}

	static log(message?: any, ...optionalParams: any[]) {
		if (TelemetryService._localLogging)
			console.warn(message, ...optionalParams);
		else
			TelemetryService._reporter?.log(message, ...optionalParams);
	}

	static warn(message?: any, ...optionalParams: any[]) {
		if (TelemetryService._localLogging)
			console.warn(message, ...optionalParams);
		else
			TelemetryService._reporter?.warn(message, ...optionalParams);
	}

	private _reporter = TelemetryService._reporter;

	get enabled() { return !!this._reporter; }

	currentSessionUrl$ = this._reporter?.currentSessionUrl$ ?? of(null);

	logMetaReducer = this._reporter?.logMetaReducer ?? null;

	constructor(private _httpConfig: HttpConfigService) {
		if (TelemetryService._instance)
			return TelemetryService._instance;

		this._switchToLocalLoggingOnLocalBackendFlag();

		return TelemetryService._instance = this;
	}

	private _switchToLocalLoggingOnLocalBackendFlag() {
		this._httpConfig.useLocalBackend$
			.subscribe(useLocalBackend =>
				TelemetryService._localLogging = TelemetryService._env.localServer || useLocalBackend
			);
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
