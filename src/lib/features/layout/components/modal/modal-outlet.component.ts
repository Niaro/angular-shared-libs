import { Component, OnInit, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, PRIMARY_OUTLET, NavigationEnd, RoutesRecognized } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { filter, map } from 'rxjs/operators';
import { unset } from 'lodash-es';

import { IModalHostComponent } from './modal-host-component.interface';
import { ModalComponent } from './modal.component';

export const MODAL_OUTLET = 'modal';

@Component({
	selector: 'bp-modal-outlet',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalOutletComponent implements OnInit {

	@ContentChild(RouterOutlet) outlet: RouterOutlet;

	private activeDialog: MatDialogRef<any, any>;
	private urlWithOutlet: string;
	private destinationUrl: string;
	private navigation: boolean;

	constructor(
		public router: Router,
		private route: ActivatedRoute,
		private dialogsManager: MatDialog
	) { }

	ngOnInit() {
		this.outlet.activateEvents.subscribe((cmpt) => this.outletActivate(cmpt));

		this.router.events
			.pipe(
				filter(e => e instanceof NavigationEnd),
				map(() => this.route.snapshot.firstChild.children.find(r => r.outlet === MODAL_OUTLET))
			)
			.subscribe(outletRoute => this.urlWithOutlet = outletRoute && this.router.url);

		// We redirect to the destination url only after the drawer is animatedly closed
		// otherwise the router outlets content in the drawer deletes right at the animation start
		// which create a nasty visual glitch
		this.router.events
			.pipe(filter(e => e instanceof RoutesRecognized && !!this.activeDialog))
			.subscribe((e: RoutesRecognized) => {
				// If the destination url doesn't have the modal outlet that means the user
				// intends to navigate to the page not to another modal
				// this.urlWithModal contains the current url from which the navigation was initiated
				// since it's updated only on NavigationEnd, but we are still processing RoutesRecognized.
				// We interrupt navigating to the destination url by renavigating back to the current url.
				this.router.navigateByUrl(this.urlWithOutlet);
				this.destinationUrl = e.url;
				this.navigation = true;
				this.activeDialog.close(); // the handler on the close event will actually navigate to the destination url
			});
	}

	private outletActivate(cmpt: IModalHostComponent) {
		if (!(cmpt.modal instanceof ModalComponent))
			throw new Error('The component attached to the modal router outlet must implement the IHostModalComponent interface');
		this.navigation = false;
		this.activeDialog = this.dialogsManager.open(cmpt.modal.template);

		this.activeDialog
			.beforeClosed()
			.subscribe(() => {
				this.activeDialog = null;
				this.router.navigateByUrl(this.navigation ? this.destinationUrl : this.getUrlWithoutModalOutlet());
			});
	}

	private getUrlWithoutModalOutlet() {
		const urlTree = this.router.parseUrl(this.router.url);
		unset(urlTree, `root.children.${PRIMARY_OUTLET}.children.${MODAL_OUTLET}`);
		return urlTree.toString();
	}
}
