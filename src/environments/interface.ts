import { Version } from './constants';

export interface IAppEnvironment {

	logrocket?: string;

	intercom?: string;

	widgetUrl?: string;

	api?: {
		url: string;
		version?: string;
	};

}

export interface IEnvironment extends IAppEnvironment {

	name: 'prod' | 'sandbox' | 'stg' | 'dev-stg' | 'dev';

	remoteServer: boolean;

	localServer: boolean;

	hmr: boolean;

	version: Version;

	mockKey: string;

	mockUrl: string;

	widgetLoaderUrl: string;

}
