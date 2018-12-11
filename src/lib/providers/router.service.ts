import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot, Params, NavigationError } from '@angular/router';
import { isNil, last, pickBy } from 'lodash-es';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';

import { LayoutFacade } from '../features/layout';
import { ResponseError } from '../models';

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

	constructor(
		public router: Router,
		public route: ActivatedRoute,
		private layout: LayoutFacade
	) {
		this.router.events
			.pipe(filter(e => e instanceof NavigationError))
			// the request prop means that an error has occurred on loading a lazy module, so we just generalize and send to the error page
			.subscribe((e: NavigationError) => e.error.request && this.navigateToErrorPage());
	}

	onPrimaryComponentNavigationEnd(component: any) {
		return this.router.events.pipe(
			filter(e => e instanceof NavigationEnd),
			map(() => RouterService.getPrimaryBranchLastRoute(this.route).component),
			distinctUntilChanged(),
			filter(it => it === component)
		);
	}

	tryNavigateOnResponseError(e: ResponseError) {
		 // fullscreen pages handle errors on its own and all the non 500+ errors should be handled manually
		if (this.layout.fullscreen || !e.is500ish)
			return;
		this.navigateToErrorPage();
	}

	private navigateToErrorPage() {
		this.router.navigate(['/error'], { replaceUrl: false, skipLocationChange: true });
	}
}
