import { Injectable } from '@angular/core';
import { environment } from '@bp/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

	isNotProd = environment.name !== 'prod' && environment.name !== 'sandbox';

	get isProd() { return !this.isNotProd; }

}
