import { from } from 'rxjs';
import { first, shareReplay } from 'rxjs/operators';
import LogRocket from 'logrocket';
import createNgrxMiddleware from 'logrocket-ngrx';

import { Dictionary } from '@bp/shared/typings';

import { IReporter } from './reporter.interface';

export class LogRocketReporter implements IReporter {

	logMetaReducer = createNgrxMiddleware(LogRocket);

	currentSessionUrl$ = from(new Promise<string>(r => LogRocket.getSessionURL(v => r(v))))
		.pipe(
			first(),
			shareReplay({ bufferSize: 1, refCount: false })
		);

	constructor(private _appId: string, private _envName: string, private _release: string) {
		this._init();
	}

	private _init() {
		LogRocket.init(this._appId, {
			release: this._release,
			dom: this._assignAssetsUrlIfPrivateApp(),
			console: {
				shouldAggregateConsoleErrors: true,
			},
			network: {
				requestSanitizer(req) {
					// if the url contains 'ignore'
					if (req.url.toLowerCase().includes('deposit'))
						// scrub out the body
						req.body = undefined;

					req.headers[ 'Authorization' ] = undefined;
					return req;
				}
			},
		});
	}

	private _assignAssetsUrlIfPrivateApp(): { baseHref: string; } | undefined {
		const isMerchantAdminApp = this._appId.includes('merchant-admin');
		const isAdminApp = /^(?!.*merchant).*admin.*$/.test(this._appId || '');
		const isDemostand = this._appId.includes('demostand');

		if (!isMerchantAdminApp && !isAdminApp && !isDemostand)
			return;

		const merchantPrefixOrEmpty = isMerchantAdminApp ? 'merchant-' : '';

		return {
			baseHref: isDemostand
				? 'https://cashier-demostand.web.app/'
				: `https://storage.googleapis.com/${ merchantPrefixOrEmpty }admin-logrocket-assets/${ this._envName }/${ this._release }/`
		};
	}

	getUrlForUserSessions(userId: string): string {
		return `https://app.logrocket.com/${ this._appId }/sessions?u=${ userId }`;
	}

	identifyUser(
		userId: string,
		userTraits?: Dictionary<string | number | boolean | null | undefined> | undefined
	): void {
		LogRocket.identify(userId, <any> userTraits);
	}

	captureError(error: any, source: string): void {
		LogRocket.captureException(
			error instanceof Error ? error : new Error(JSON.stringify(error)),
			{ tags: { source } }
		);
	}

	captureMessage(message: string): void {
		LogRocket.captureMessage(message, { tags: { source: 'code' } });
	}

	warn(...args: any[]) {
		LogRocket.warn(...args);
	}

	log(...args: any[]) {
		LogRocket.log(...args);
	}

}
