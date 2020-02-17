import { Injectable, Type } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, NavigationError, NavigationStart, NavigationExtras } from '@angular/router';
import { filter, distinctUntilChanged, map, share } from 'rxjs/operators';

import { UrlHelper } from '../utils/url-helper';
import { ResponseError } from '../models/api';

@Injectable({
	providedIn: 'root'
})
export class RouterService {

	navigationStart$ = this.ngRouter.events.pipe(
		filter(it => it instanceof NavigationStart),
		map(v => <NavigationStart> v),
		share()
	);

	navigationEnd$ = this.ngRouter.events.pipe(
		filter(it => it instanceof NavigationEnd),
		map(v => <NavigationEnd> v),
		share()
	);

	isNavigateToErrorPage = true;

	constructor(
		public ngRouter: Router,
		public route: ActivatedRoute
	) {
		this.ngRouter.events
			// the request prop means that an error has occurred on loading a lazy module,
			// so we just generalize and send to the error page
			.subscribe((e) => e instanceof NavigationError && e.error.request && this._navigateToErrorPage());
	}

	navigate(commands: any[], extras: (NavigationExtras & { relativeToCmpt: any; })) {
		this.ngRouter.navigate(commands, {
			...extras,
			relativeTo: <ActivatedRoute> UrlHelper.getComponentRoute(this.route, extras.relativeToCmpt)
		});
	}

	closeOutlet(outlet: string) {
		this.ngRouter.navigateByUrl(UrlHelper.getUrlExcludingOutlet(outlet, this.ngRouter));
	}

	onPrimaryComponentNavigationEnd(component: any) {
		return this.ngRouter.events.pipe(
			filter(e => e instanceof NavigationEnd),
			map(() => UrlHelper.getMainBranchLastRoute(this.route).component),
			distinctUntilChanged(),
			filter(it => it === component)
		);
	}

	onNavigationEnd(cmptType: Type<any>) {
		return this.ngRouter.events.pipe(
			filter(e => e instanceof NavigationEnd),
			map(() => <ActivatedRoute> UrlHelper.getComponentRoute(this.route, cmptType)),
			distinctUntilChanged((x, y) => (x && x.component) === (y && y.component)),
			filter(v => v && v.component === cmptType)
		);
	}

	tryNavigateOnResponseError(e: ResponseError) {
		// fullscreen pages handle errors on its own like the login page and all the non 500+ errors should be handled
		// manually
		if (!this.isNavigateToErrorPage || !e.isInternalServerError)
			return;
		this._navigateToErrorPage();
	}

	private _navigateToErrorPage() {
		this.ngRouter.navigate([ '/error' ], { replaceUrl: false, skipLocationChange: true });
	}
}
