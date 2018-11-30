export interface IAppEnvironment {
	api: {
		url: string;
		version: string;
	};
}

export interface IEnvironment extends IAppEnvironment {
	name: 'prod' | 'sandbox' | 'stg' | 'dev-stg' | 'dev';
	prod: boolean;
	dev: boolean;
	hmr: boolean;
	version: string;
	mockKey: string;
}
