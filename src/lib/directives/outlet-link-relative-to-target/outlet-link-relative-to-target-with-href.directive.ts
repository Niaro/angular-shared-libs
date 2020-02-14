import { Directive, OnChanges, OnDestroy, HostBinding, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocationStrategy } from '@angular/common';
import { isString } from 'lodash-es';

import { attrBoolValue } from '@bp/shared/utils';

import { OutletLinkRelativeToTargetBaseDirective } from './outlet-link-relative-to-target-base.directive';

@Directive({
	// tslint:disable-next-line: directive-selector
	selector: 'a[outletLinkRelativeToParent], a[outletLinkRelativeToRoot]'
})
export class OutletLinkRelativeToTargetWithHrefDirective
	extends OutletLinkRelativeToTargetBaseDirective
	implements OnChanges, OnDestroy {

	@HostBinding('attr.target') @Input() target!: string;

	@Input() state?: { [k: string]: any; };

	// the url displayed on the anchor element.
	@HostBinding() href!: string;

	private _subscription: Subscription;

	constructor(
		private _locationStrategy: LocationStrategy,
		router: Router,
		route: ActivatedRoute,
	) {
		super(router, route);
		this._subscription = this._router.events
			.subscribe((s: Event) => s instanceof NavigationEnd && this._updateTargetUrlAndHref());
	}

	ngOnChanges() { this._updateTargetUrlAndHref(); }

	ngOnDestroy() { this._subscription.unsubscribe(); }

	@HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey', '$event.shiftKey'])
	onClick(button: number, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean): boolean {
		if (button !== 0 || ctrlKey || metaKey || shiftKey)
			return true;

		if (isString(this.target) && this.target !== '_self')
			return true;

		this._router.navigateByUrl(this._urlTree, {
			skipLocationChange: attrBoolValue(this.skipLocationChange),
			replaceUrl: attrBoolValue(this.replaceUrl),
			state: this.state
		});

		return false;
	}

	private _updateTargetUrlAndHref(): void {
		this.href = this._locationStrategy.prepareExternalUrl(this._router.serializeUrl(this._urlTree));
	}
}
