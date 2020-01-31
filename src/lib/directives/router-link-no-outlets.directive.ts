import { Directive, Input, OnChanges, OnDestroy, HostBinding, HostListener } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { UrlTree, Router, ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, UrlSegmentGroup, QueryParamsHandling } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { isString } from 'lodash-es';

import { AsyncVoidSubject } from '../rxjs';

/**
 * We need our own implementation of RouterLink directive because the angular's directive
 * doesn't remove current outlets presented in url from generated links
 */

@Directive({
	selector: 'a[routerLinkNoOutlets]' // tslint:disable-line
})
export class RouterLinkNoOutletsWithHrefDirective implements OnChanges, OnDestroy {

	@Input()
	set routerLinkNoOutlets(commands: any[] | string) {
		if (commands != null)
			this.commands = Array.isArray(commands) ? commands : [commands];
		else
			this.commands = [];
	}

	@HostBinding('attr.target') @Input() target!: string;

	@Input() queryParams!: { [k: string]: any };

	@Input() fragment!: string;

	@Input() queryParamsHandling!: QueryParamsHandling;

	@Input() preserveFragment!: boolean;

	@Input() skipLocationChange!: boolean;

	@Input() replaceUrl!: boolean;

	@Input() state?: { [k: string]: any };

	// the url displayed on the anchor element.
	@HostBinding() href!: string;

	private commands: any[] = [];
	private destroyed$ = new AsyncVoidSubject();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private locationStrategy: LocationStrategy
	) {
		router.events
			.pipe(
				filter(e => e instanceof NavigationEnd),
				takeUntil(this.destroyed$),
			)
			.subscribe(() => this.updateTargetUrlAndHref());
	}

	ngOnChanges() { this.updateTargetUrlAndHref(); }
	ngOnDestroy() { this.destroyed$.complete(); }

	@HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey', '$event.shiftKey'])
	onClick(button: number, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean): boolean {
		if (button !== 0 || ctrlKey || metaKey || shiftKey)
			return true;

		if (isString(this.target) && this.target !== '_self')
			return true;

		this.router.navigateByUrl(this.urlTree, {
			skipLocationChange: attrBoolValue(this.skipLocationChange),
			replaceUrl: attrBoolValue(this.replaceUrl),
			state: this.state
		});

		return false;
	}

	private updateTargetUrlAndHref(): void {
		this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree));
	}

	get urlTree(): UrlTree {
		let tree = this.router.createUrlTree([{ outlets: { [PRIMARY_OUTLET]: this.commands }}], {
			relativeTo: this.route.root,
			queryParams: this.queryParams,
			fragment: this.fragment,
			queryParamsHandling: this.queryParamsHandling,
			preserveFragment: attrBoolValue(this.preserveFragment)
		});

		// clone tree, cause createUrlTree creates shared tree with the router and
		// we don't want to affect inner router state
		tree = this.router.parseUrl(tree.toString());

		this.removeNonPrimaryOutlets(tree.root);

		return tree;
	}

	private removeNonPrimaryOutlets({ children }: UrlSegmentGroup) {
		for (const key in children) {
			if (children.hasOwnProperty(key)) {
				if (key === PRIMARY_OUTLET)
					this.removeNonPrimaryOutlets(children[key]);
				else
					delete children[key];
			}
		}
	}
}

function attrBoolValue(s: any): boolean {
	return s === '' || !!s;
}
