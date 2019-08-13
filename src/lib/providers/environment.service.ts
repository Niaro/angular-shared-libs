import { Injectable } from '@angular/core';
import { environment } from '@bp/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
	get isProd() { return environment.name === 'prod'; }

	get isNotProd() { return !this.isProd; }

	get isNotProdOrSandbox() { return this.isNotProd && environment.name !== 'sandbox'; }
}
