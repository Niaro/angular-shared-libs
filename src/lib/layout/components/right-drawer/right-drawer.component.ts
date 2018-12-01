import { Component, ChangeDetectionStrategy, ContentChild, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, RouterOutlet, NavigationEnd, PRIMARY_OUTLET, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { filter, map, first, takeUntil } from 'rxjs/operators';
import { mapValues, last } from 'lodash-es';
import { LayoutFacade } from '../../state';
import { fromEvent, AsyncSubject } from 'rxjs';

@Component({
	selector: 'bp-right-drawer',
	templateUrl: './right-drawer.component.html',
	styleUrls: ['./right-drawer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RightDrawerComponent implements OnInit, OnDestroy {
	@ContentChild(RouterOutlet) outlet: RouterOutlet;
	@ViewChild(MatSidenav) drawer: MatSidenav;

	private urlPrimary: string;
	private urlWithOutlet: string;
	private outletUrlHistory: string[] = [];
	private saveUrlWithOutletToHistory = true;
	private get outletName() { return this.outlet['name']; }
	private destroyed$ = new AsyncSubject();

	constructor(
		public layout: LayoutFacade,
		public router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		fromEvent<KeyboardEvent>(window, 'keydown')
			.pipe(
				filter(it => this.drawer.opened && it.key === 'Escape'),
				takeUntil(this.destroyed$)
			)
			.subscribe(() => this.layout.closeRightDrawer());

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
			.pipe(filter(e => e instanceof NavigationEnd))
			.subscribe(() => this.urlPrimary = this.parseUrl(this.router.url)[PRIMARY_OUTLET]);

		this.router.events
			.pipe(
				filter(e => e instanceof NavigationEnd),
				map(() => this.route.snapshot.children.find(r => r.outlet === this.outletName))
			)
			.subscribe(outletRoute => this.urlWithOutlet = outletRoute && this.router.url);

		// We redirect to the destination url only after the drawer is animatedly closed
		// otherwise the router outlets content in the drawer deletes right at the animation start
		// which create a nasty visual glitch
		this.router.events
			.pipe(filter(e => e instanceof RoutesRecognized && this.drawer.opened))
			.subscribe((e: RoutesRecognized) => {
				const outletUrls = this.parseUrl(e.url);
				if (outletUrls[this.outletName]) {
					const nextUrlIsLastInHistory = last(this.outletUrlHistory) === e.url;
					nextUrlIsLastInHistory && this.outletUrlHistory.pop();
					this.saveUrlWithOutletToHistory = !nextUrlIsLastInHistory;
				} else {
					// If the destination url doesn't have the modal outlet that means the user
					// intends to navigate to the page not to another modal
					// this.urlWithModal contains the current url from which the navigation was initiated
					// since it's updated only on NavigationEnd, but we are still processing RoutesRecognized.
					// We interrupt navigating to the destination url by renavigating back to the current url.
					this.router.navigateByUrl(this.urlWithOutlet);
					this.urlPrimary = outletUrls[PRIMARY_OUTLET];
					this.outletUrlHistory = [];
					this.layout.closeRightDrawer(); // the handler on the close event will actually navigate to the destination url
				}
			});
	}

	ngOnDestroy() {
		this.destroyed$.next(null);
		this.destroyed$.complete();
	}

	private outletActivate() {
		this.saveUrlWithOutletToHistory = true;
		this.layout.openRightDrawer();

		// closed by click on backdrop, or by esc, or somewhere else programmatically
		this.drawer.closedStart
			.pipe(
				filter(() => this.outletUrlHistory.length > 0),
				first()
			)
			.subscribe(() => this.navigateToPrevOpenInDrawerRoute());

		this.drawer._closedStream
			.pipe(first())
			.subscribe(() => this.navigateToPrevOpenInDrawerRoute());
	}

	private navigateToPrevOpenInDrawerRoute() {
		this.saveUrlWithOutletToHistory = false;
		this.router.navigateByUrl(this.outletUrlHistory.pop() || this.urlPrimary);
	}

	private outletDeactivate() {
		this.saveUrlWithOutletToHistory && this.outletUrlHistory.push(this.urlWithOutlet);
	}

	private parseUrl(url: string): { [outlet: string]: string } {
		return mapValues(
			this.router.parseUrl(url).root.children,
			value => value.toString()
		);
	}
}
