import { Params } from '@angular/router';

export interface IRouterStateUrl {
	url: string;
	params: Params;
	data: Params;
	queryParams: Params;
}
