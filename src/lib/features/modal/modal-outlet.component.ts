import { Component, OnInit, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { RouterOutlet, Router, PRIMARY_OUTLET, NavigationEnd, RoutesRecognized } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { filter } from 'rxjs/operators';
import { unset, has } from 'lodash-es';

import { IModalHostComponent } from './modal-host-component.interface';
import { ModalComponent } from './modal.component';

export const MODAL_OUTLET = 'modal';
const URL_TREE_PRIMARY_MODAL_OUTLET_PATH = `root.children.${PRIMARY_OUTLET}.children.${MODAL_OUTLET}`;
const URL_TREE_MODAL_OUTLET_PATH = `root.children.${MODAL_OUTLET}`;

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
		private dialogsManager: MatDialog
	) { }

	ngOnInit() {
		this.outlet.activateEvents.subscribe(cmpt => this.outletActivate(cmpt));

		this.router.events
			.pipe(filter(e => e instanceof NavigationEnd))
			.subscribe((e: NavigationEnd) => this.urlWithOutlet = this.hasUrlModalOutlet(e.url) ? this.router.url : undefined);

		// We redirect to the destination url only after the drawer is animatedly closed
		// otherwise the router outlets content in the drawer deletes right at the animation start
		// which create a nasty visual glitch
		this.router.events
			.pipe(filter(e => e instanceof RoutesRecognized && !!this.activeDialog))
			.subscribe((e: RoutesRecognized) => {
				if (this.hasUrlModalOutlet(e.url))
					return;

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
		this.activeDialog = this.dialogsManager.open(cmpt.modal.template, {
			panelClass: [...cmpt.panelClass, 'bp-overlay-pane', 'mat-typography']
		});

		this.activeDialog
			.beforeClosed()
			.subscribe(() => {
				this.activeDialog = null;
				this.router.navigateByUrl(this.navigation ? this.destinationUrl : this.getUrlWithoutModalOutlet());
			});
	}

	private getUrlWithoutModalOutlet() {
		const urlTree = this.router.parseUrl(this.router.url);
		unset(urlTree, URL_TREE_PRIMARY_MODAL_OUTLET_PATH);
		unset(urlTree, URL_TREE_MODAL_OUTLET_PATH);
		return urlTree.toString();
	}

	private hasUrlModalOutlet(url: string): boolean {
		const urlTree = this.router.parseUrl(url);
		return has(urlTree, URL_TREE_PRIMARY_MODAL_OUTLET_PATH) || has(urlTree, URL_TREE_MODAL_OUTLET_PATH);
	}
}
