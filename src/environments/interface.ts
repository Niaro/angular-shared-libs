import { Version } from './constants';

export interface IAppEnvironment {
	api?: {
		url: string;
		version?: string;
	};
}

export interface IEnvironment extends IAppEnvironment {
	name: 'prod' | 'sandbox' | 'stg' | 'dev-stg' | 'dev';
	prod: boolean;
	dev: boolean;
	hmr: boolean;
	version: Version;
	mockKey: string;
	mockUrl: string;
	cashierWidgetUrl: string;
}
