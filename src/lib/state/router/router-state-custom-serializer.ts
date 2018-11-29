import { Injectable } from '@angular/core';
import { RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import { IRouterStateUrl } from './router.state';

@Injectable()
export class RouterStateCustomSerializer implements RouterStateSerializer<IRouterStateUrl> {
	serialize(routerState: RouterStateSnapshot): IRouterStateUrl {
		let route = routerState.root;

		while (route.firstChild)
			route = route.firstChild;

		const { url, root: { queryParams } } = routerState;
		const { params, data } = route;

		return { url, data, params, queryParams };
	}
}
