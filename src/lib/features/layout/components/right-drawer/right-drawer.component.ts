import { Component, ChangeDetectionStrategy, ContentChild, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, RouterOutlet, NavigationEnd, PRIMARY_OUTLET, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { filter, map, first, takeUntil } from 'rxjs/operators';
import { last, unset, has } from 'lodash-es';
import { fromEvent } from 'rxjs';

import { AsyncVoidSubject } from '@bp/shared/rxjs';
import { LayoutFacade } from '../../state';

export type RightDrawerNames = 'primary' | 'root';

@Component({
	selector: 'bp-right-drawer',
	templateUrl: './right-drawer.component.html',
	styleUrls: ['./right-drawer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RightDrawerComponent implements OnInit, OnDestroy {
	@Input() name: RightDrawerNames;
	@ContentChild(RouterOutlet) outlet: RouterOutlet;
	@ViewChild(MatSidenav) drawer: MatSidenav;

	private urlWithOutlet: string;
	private outletUrlHistory: string[] = [];
	private saveUrlWithOutletToHistory = true;

	private navigation = false;
	private destinationUrl: string;
	private get outletName() { return this.outlet['name']; }
	private destroyed$ = new AsyncVoidSubject();
	private drawerOutletUrlTreePath: string;

	constructor(
		public layout: LayoutFacade,
		public router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.drawerOutletUrlTreePath = this.getDrawerOutletUrlTreePath();

		fromEvent<KeyboardEvent>(window, 'keydown')
			.pipe(
				filter(it => this.drawer.opened && it.key === 'Escape'),
				takeUntil(this.destroyed$)
			)
			.subscribe(() => this.layout.closeRightDrawer(this.name));

		this.outlet.activateEvents.subscribe(() => this.outletActivate());
		this.outlet.deactivateEvents.subscribe(() => this.outletDeactivate());

		// this.router.events
		// 	.pipe(
		// 	tap(v => console.warn('events', v)),
		// 		filter(e => e instanceof ActivationEnd),
		// 		map((e: ActivationEnd) => e.snapshot.outlet),
		// 		pairwise(),
		// 		tap(v => console.warn('wrtf', v))
		// 	)
		// 	.subscribe(([prevOutlet]) => this.drawer['_enableAnimations'] = prevOutlet !== this.outletName);

		this.router.events
			.pipe(
				filter(e => e instanceof NavigationEnd),
				map(() => this.route.snapshot.firstChild.children.find(r => r.outlet === this.outletName))
			)
			.subscribe(outletRoute => this.urlWithOutlet = outletRoute && this.router.url);

		// We redirect to the destination url only after the drawer is animatedly closed
		// otherwise the router outlets content in the drawer deletes right at the animation start
		// which create a nasty visual glitch
		this.router.events
			.pipe(filter(e => e instanceof RoutesRecognized && this.drawer.opened))
			.subscribe((e: RoutesRecognized) => {
				if (this.hasUrlDrawerOutlet(e.url)) {
					const nextUrlIsLastInHistory = last(this.outletUrlHistory) === e.url;
					nextUrlIsLastInHistory && this.outletUrlHistory.pop();
					this.saveUrlWithOutletToHistory = !nextUrlIsLastInHistory;
				} else if (this.urlWithOutlet) {
					// If the destination url doesn't have the modal outlet that means the user
					// intends to navigate to the page not to another modal
					// this.urlWithModal contains the current url from which the navigation was initiated
					// since it's updated only on NavigationEnd, but we are still processing RoutesRecognized.
					// We interrupt navigating to the destination url by renavigating back to the current url.
					this.router.navigateByUrl(this.urlWithOutlet);
					this.outletUrlHistory = [];
					this.navigation = true;
					this.destinationUrl = e.url;
					this.layout.closeRightDrawer(this.name); // the handler on the close event will actually navigate to the destination url
				}
			});
	}

	ngOnDestroy() {
		this.destroyed$.complete();
	}

	private outletActivate() {
		this.navigation = false;
		this.saveUrlWithOutletToHistory = true;
		this.layout.openRightDrawer(this.name);

		// closed by click on backdrop, or by esc, or somewhere else programmatically
		this.drawer.closedStart
			.pipe(
				filter(() => this.outletUrlHistory.length > 0),
				first()
			)
			.subscribe(() => this.navigateToPrevOpenInDrawerRouteOrToDestUrl());

		this.drawer._closedStream
			.pipe(first())
			.subscribe(() => this.navigateToPrevOpenInDrawerRouteOrToDestUrl());
	}

	private navigateToPrevOpenInDrawerRouteOrToDestUrl() {
		this.saveUrlWithOutletToHistory = false;
		this.router.navigateByUrl(this.navigation ? this.destinationUrl : (this.outletUrlHistory.pop() || this.getUrlWithoutDrawerOutlet()));
	}

	private outletDeactivate() {
		this.saveUrlWithOutletToHistory && this.outletUrlHistory.push(this.urlWithOutlet);
	}

	private getUrlWithoutDrawerOutlet() {
		const urlTree = this.router.parseUrl(this.router.url);
		unset(urlTree, this.drawerOutletUrlTreePath);
		return urlTree.toString();
	}

	private hasUrlDrawerOutlet(url: string): boolean {
		const urlTree = this.router.parseUrl(url);
		return has(urlTree, this.drawerOutletUrlTreePath);
	}

	private getDrawerOutletUrlTreePath() {
		return 'root.children.' + (this.name === 'root'
			? this.outletName
			: `${PRIMARY_OUTLET}.children.${this.outletName}`);
	}
}
