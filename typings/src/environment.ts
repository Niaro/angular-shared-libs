import { IVersion } from './version';

export interface IAppEnvironment {

	readonly logrocket?: string;

	readonly intercom?: string;

	readonly cashierAppUrl?: string;

	readonly api?: {
		url: string;
		version?: string;
	};

}

export interface IEnvironment extends IAppEnvironment {

	readonly name: 'prod' | 'sandbox' | 'stg' | 'dev';

	readonly remoteServer: boolean;

	readonly localServer: boolean;

	readonly version: IVersion;

	readonly cashierLoaderUrl: string;

}
