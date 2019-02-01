import { Injectable, Type } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, NavigationError, NavigationStart } from '@angular/router';
import { filter, distinctUntilChanged, map, share } from 'rxjs/operators';

import { UrlHelper } from '../utils';
import { LayoutFacade } from '../features/layout';
import { ResponseError } from '../models';

@Injectable({
	providedIn: 'root'
})
export class RouterService {

	navigationStart$ = this.router.events.pipe(
		filter(it => it instanceof NavigationStart),
		share()
	);

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
		if (this.layout.fullscreen || !e.is500ish)
			return;
		this.navigateToErrorPage();
	}

	private navigateToErrorPage() {
		this.router.navigate(['/error'], { replaceUrl: false, skipLocationChange: true });
	}
}
