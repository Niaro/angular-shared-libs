import { Injectable } from '@angular/core';
import { environment } from '@bp/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

	isNotProdLike = environment.name !== 'prod' && environment.name !== 'sandbox';

	get isProdLike() { return !this.isNotProdLike; }

}
