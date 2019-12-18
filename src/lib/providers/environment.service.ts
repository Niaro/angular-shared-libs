import { Injectable } from '@angular/core';
import { environment } from '@bp/environment';
console.warn(environment);
@Injectable({
	providedIn: 'root'
})
export class EnvironmentService {

	version = environment.version;

	name = environment.name;

	get isRemoteServer() { return environment.remoteServer; }

	get isProd() { return environment.name === 'prod'; }

	get isNotProd() { return !this.isProd; }

	get isNotProdOrSandbox() { return this.isNotProd && environment.name !== 'sandbox'; }

}
