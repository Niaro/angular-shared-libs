import { Component, OnInit, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { RouterOutlet, Router, PRIMARY_OUTLET, NavigationEnd, RoutesRecognized } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter, map } from 'rxjs/operators';
import { unset, has } from 'lodash-es';

import { MODAL_OUTLET } from '@bp/shared/models/constants';

import { IModalHostComponent } from './modal-host-component.interface';
import { ModalComponent } from './modal.component';

const URL_TREE_PRIMARY_MODAL_OUTLET_PATH = `root.children.${ PRIMARY_OUTLET }.children.${ MODAL_OUTLET }`;
const URL_TREE_MODAL_OUTLET_PATH = `root.children.${ MODAL_OUTLET }`;

@Component({
	selector: 'bp-modal-outlet',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalOutletComponent implements OnInit {

	@ContentChild(RouterOutlet, { static: true }) outlet!: RouterOutlet;

	private _activeDialog!: MatDialogRef<any, any> | null;

	private _urlWithOutlet!: string | null;

	private _destinationUrl!: string;

	private _navigation!: boolean;

	constructor(
		public router: Router,
		private _dialogsManager: MatDialog
	) { }

	ngOnInit() {
		this.outlet.activateEvents.subscribe((cmpt: IModalHostComponent) => this._outletActivate(cmpt));

		this.router.events
			.pipe(
				filter(e => e instanceof NavigationEnd),
				map(v => <NavigationEnd> v)
			)
			.subscribe(e => this._urlWithOutlet = this._hasUrlModalOutlet(e.url)
				? this.router.url
				: null
			);

		// We redirect to the destination url only after the drawer is animatedly closed
		// otherwise the router outlets content in the drawer deletes right at the animation start
		// which create a nasty visual glitch
		this.router.events
			.pipe(
				filter(e => e instanceof RoutesRecognized && !!this._activeDialog),
				map(v => <RoutesRecognized> v)
			)
			.subscribe(e => {
				if (!this._urlWithOutlet || this._hasUrlModalOutlet(e.url))
					return;

				// If the destination url doesn't have the modal outlet that means the user
				// intends to navigate to the page not to another modal
				// this.urlWithModal contains the current url from which the navigation was initiated
				// since it's updated only on NavigationEnd, but we are still processing RoutesRecognized.
				// We interrupt navigating to the destination url by renavigating back to the current url.
				this.router.navigateByUrl(this._urlWithOutlet);
				this._destinationUrl = e.url;
				this._navigation = true;

				// the handler on the close event will actually navigate to the destination url
				this._activeDialog && this._activeDialog.close();
			});
	}

	private _outletActivate(cmpt: IModalHostComponent) {
		if (!(cmpt.modal instanceof ModalComponent))
			throw new Error('The component attached to the modal router outlet must implement \ the IHostModalComponent interface');

		this._navigation = false;
		this._activeDialog = this._dialogsManager.open(cmpt.modal.template, {
			panelClass: [ ...(cmpt.panelClass || []), 'bp-modal-overlay-pane' ]
		});

		this._activeDialog
			.beforeClosed()
			.subscribe(() => {
				this._activeDialog = null;
				this.router.navigateByUrl(this._navigation ? this._destinationUrl : this._getUrlWithoutModalOutlet());
			});
	}

	private _getUrlWithoutModalOutlet() {
		const urlTree = this.router.parseUrl(this.router.url);
		unset(urlTree, URL_TREE_PRIMARY_MODAL_OUTLET_PATH);
		unset(urlTree, URL_TREE_MODAL_OUTLET_PATH);
		return urlTree.toString();
	}

	private _hasUrlModalOutlet(url: string): boolean {
		const urlTree = this.router.parseUrl(url);
		return has(urlTree, URL_TREE_PRIMARY_MODAL_OUTLET_PATH) || has(urlTree, URL_TREE_MODAL_OUTLET_PATH);
	}
}
