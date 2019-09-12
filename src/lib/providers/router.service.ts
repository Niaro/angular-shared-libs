import { Injectable, Type } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, NavigationError, NavigationStart } from '@angular/router';
import { filter, distinctUntilChanged, map, share } from 'rxjs/operators';

import { UrlHelper } from '../utils/url-helper';
import { ResponseError } from '../models/api';

@Injectable({
	providedIn: 'root'
})
export class RouterService {

	navigationStart$ = this.router.events.pipe(
		filter(it => it instanceof NavigationStart),
		share()
	);

	isNavigateToErrorPage = true;

	constructor(
		public router: Router,
		public route: ActivatedRoute
	) {
		this.router.events
			// the request prop means that an error has occurred on loading a lazy module, so we just generalize and send to the error page
			.subscribe((e) => e instanceof NavigationError && e.error.request && this.navigateToErrorPage());
	}

	onPrimaryComponentNavigationEnd(component: any) {
		return this.router.events.pipe(
			filter(e => e instanceof NavigationEnd),
			map(() => UrlHelper.getMainBranchLastRoute(this.route).component),
			distinctUntilChanged(),
			filter(it => it === component)
		);
	}

	onNavigationEnd(cmptType: Type<any>) {
		return this.router.events.pipe(
			filter(e => e instanceof NavigationEnd),
			map(() => UrlHelper.getComponentRoute(this.route, cmptType) as ActivatedRoute),
			distinctUntilChanged((x, y) => (x && x.component) === (y && y.component)),
			filter(v => v && v.component === cmptType)
		);
	}

	tryNavigateOnResponseError(e: ResponseError) {
		 // fullscreen pages handle errors on its own and all the non 500+ errors should be handled manually
		if (!this.isNavigateToErrorPage || !e.isInternalServerError)
			return;
		this.navigateToErrorPage();
	}

	private navigateToErrorPage() {
		this.router.navigate(['/error'], { replaceUrl: false, skipLocationChange: true });
	}
}
