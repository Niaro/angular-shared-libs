import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';
import { isNil, last, pickBy } from 'lodash-es';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class RouterService {
	static getPrimaryLastRouteParams(route: ActivatedRoute): Params {
		const snapshot = this.getPrimaryBranchLastRoute(route.snapshot);
		const params = snapshot.url.length ? last(snapshot.url).parameters : snapshot.params;
		return pickBy(params, v => !isNil(v));
	}

	static getQueryParams(route: ActivatedRoute): Params {
		const snapshot = this.getPrimaryBranchLastRoute(route.snapshot);
		return pickBy(snapshot.queryParams, v => !isNil(v));
	}

	static getPrimaryBranchRoutes<T extends ActivatedRouteSnapshot | ActivatedRoute>(route: T): T[] {
		const results: T[] = [route];
		while (route.firstChild) {
			route = route.firstChild as T;
			results.push(route);
		}
		return results;
	}

	static getPrimaryBranchLastRoute<T extends ActivatedRouteSnapshot | ActivatedRoute>(route: T): T {
		while (route.firstChild)
			route = route.firstChild as T;
		return route;
	}

	constructor(public router: Router, public route: ActivatedRoute) { }

	onPrimaryComponentNavigationEnd(component: any) {
		return this.router.events.pipe(
			filter(e => e instanceof NavigationEnd),
			map(() => RouterService.getPrimaryBranchLastRoute(this.route).component),
			filter(it => it === component),
			distinctUntilChanged()
		);
	}
}
