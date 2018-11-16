export interface IAppEnvironment {
	api: {
		url: string;
		version: string;
	};
}

export interface IEnvironment extends IAppEnvironment {
	prod: boolean;
	dev: boolean;
	hmr: boolean;
}
