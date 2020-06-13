import { Injectable } from '@angular/core';
import { IEnvironment } from '@bp/shared/typings';


@Injectable({
	providedIn: 'root'
})
export class EnvironmentService implements IEnvironment {

	private static _env: IEnvironment;

	static init(env: IEnvironment) {
		EnvironmentService._env = env;
	}

	private readonly _env = EnvironmentService._env;

	readonly remoteServer = this._env.remoteServer;

	readonly localServer = this._env.localServer;

	readonly cashierLoaderUrl = this._env.cashierLoaderUrl;

	readonly logrocket = this._env.logrocket;

	readonly intercom = this._env.intercom;

	readonly cashierAppUrl = this._env.cashierAppUrl;

	readonly api = this._env.api || { url: '', version: '' };

	readonly version = this._env.version;

	readonly name = this._env.name;

	readonly isProd = this.name === 'prod';

	readonly isNotProd = !this.isProd;

	readonly isSandbox = this.name === 'sandbox';

	readonly isNotProdOrSandbox = this.isNotProd && !this.isSandbox;

	readonly isDemostand = location.hostname.includes('cashier-demostand');

}
