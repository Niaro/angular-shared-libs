import { Dictionary } from '@bp/shared/typings';
import { MetaReducer } from '@ngrx/store';
import { Observable } from 'rxjs';

export interface IReporter {

	logMetaReducer: MetaReducer<any> | null;

	currentSessionUrl$: Observable<string | null>;

	getUrlForUserSessions(userId: string): string | null;

	identifyUser(userId: string, userTraits?: Dictionary<string | number | boolean | null | undefined>): void;

	/**
	 *  Notifies listeners about the error
	 */
	captureError(error: Error | any, source: string): void;


	/**
	 *  Notifies listeners about the message
	 */
	captureMessage(message: string): void;

	warn(message?: any, ...optionalParams: any[]): void;

	log(message?: any, ...optionalParams: any[]): void;

}
