import { Directive, Input, OnChanges, HostBinding, HostListener } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { UrlTree, Router, ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, UrlSegmentGroup, QueryParamsHandling } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isString } from 'lodash-es';

import { Destroyable } from '@bp/shared/models/common';

/**
 * We need our own implementation of RouterLink directive because the angular's directive
 * doesn't remove current outlets presented in url from generated links
 */

@Directive({
	selector: 'a[routerLinkNoOutlets]' // tslint:disable-line
})
export class RouterLinkNoOutletsWithHrefDirective extends Destroyable implements OnChanges {

	@Input()
	set routerLinkNoOutlets(commands: any[] | string) {
		if (commands != null)
			this._commands = Array.isArray(commands) ? commands : [ commands ];
		else
			this._commands = [];
	}

	@HostBinding('attr.target') @Input() target!: string;

	@Input() queryParams!: { [ k: string ]: any; };

	@Input() fragment!: string;

	@Input() queryParamsHandling!: QueryParamsHandling;

	@Input() preserveFragment!: boolean;

	@Input() skipLocationChange!: boolean;

	@Input() replaceUrl!: boolean;

	@Input() state?: { [ k: string ]: any; };

	// the url displayed on the anchor element.
	@HostBinding() href!: string;

	private _commands: any[] = [];

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _locationStrategy: LocationStrategy
	) {
		super();

		_router.events
			.pipe(
				filter(e => e instanceof NavigationEnd),
				this.takeUntilDestroyed,
			)
			.subscribe(() => this._updateTargetUrlAndHref());
	}

	ngOnChanges() { this._updateTargetUrlAndHref(); }

	@HostListener('click', [ '$event.button', '$event.ctrlKey', '$event.metaKey', '$event.shiftKey' ])
	onClick(button: number, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean): boolean {
		if (button !== 0 || ctrlKey || metaKey || shiftKey)
			return true;

		if (isString(this.target) && this.target !== '_self')
			return true;

		this._router.navigateByUrl(this.urlTree, {
			skipLocationChange: attrBoolValue(this.skipLocationChange),
			replaceUrl: attrBoolValue(this.replaceUrl),
			state: this.state
		});

		return false;
	}

	private _updateTargetUrlAndHref(): void {
		this.href = this._locationStrategy.prepareExternalUrl(this._router.serializeUrl(this.urlTree));
	}

	get urlTree(): UrlTree {
		let tree = this._router.createUrlTree([ { outlets: { [ PRIMARY_OUTLET ]: this._commands } } ], {
			relativeTo: this._route.root,
			queryParams: this.queryParams,
			fragment: this.fragment,
			queryParamsHandling: this.queryParamsHandling,
			preserveFragment: attrBoolValue(this.preserveFragment)
		});

		// clone tree, cause createUrlTree creates shared tree with the router and
		// we don't want to affect inner router state
		tree = this._router.parseUrl(tree.toString());

		this._removeNonPrimaryOutlets(tree.root);

		return tree;
	}

	private _removeNonPrimaryOutlets({ children }: UrlSegmentGroup) {
		for (const key in children) {
			if (!children.hasOwnProperty(key))
				continue;

			if (key === PRIMARY_OUTLET)
				this._removeNonPrimaryOutlets(children[ key ]);
			else
				delete children[ key ];
		}
	}
}

function attrBoolValue(s: any): boolean {
	return s === '' || !!s;
}
