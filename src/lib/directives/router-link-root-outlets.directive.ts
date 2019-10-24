import { Directive, OnChanges, OnDestroy, HostBinding, Input, HostListener, Renderer2, Attribute, ElementRef } from '@angular/core';
import { QueryParamsHandling, Router, ActivatedRoute, NavigationEnd, UrlTree, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocationStrategy } from '@angular/common';
import { isString, isObject } from 'lodash-es';
import { Dictionary } from 'lodash';

/**
 * The native router link directive creates an url relative to the activated route
 * which requires the routes in the secondary outlets to be children of the activated route on
 * the route config. In that case you can access the route in the secondary outlet only being
 * under the activated route. Thus if you have a route on the root route config level and you want
 * to reach it being deep inside the primary routes tree, you have to create an url tree still
 * related to the root route.
 * The purpose of this directive to create an outlet link always relative to the root route
 */
@Directive({
	// tslint:disable-next-line: directive-selector
	selector: 'a[routerLinkRootOutlets]'
})
export class RouterLinkRootOutletsWithHrefDirective implements OnChanges, OnDestroy {
	@Input()
	set routerLinkRootOutlets(outlets: Dictionary<any[]>) {
		if (!isObject(outlets))
			throw new Error('RouterLinkOutlets accepts only a dictionary where the keys are the outlet names and the values are the route commands');

		this.commands = [{ outlets }];
	}

	@HostBinding('attr.target') @Input() target!: string;

	@Input() queryParams!: { [k: string]: any };

	@Input() fragment!: string;

	@Input() queryParamsHandling!: QueryParamsHandling;

	@Input() preserveFragment!: boolean;

	@Input() skipLocationChange!: boolean;

	@Input() replaceUrl!: boolean;

	@Input() state?: { [k: string]: any };

	private commands: any[] = [];

	private subscription: Subscription;

	// the url displayed on the anchor element.
	@HostBinding() href!: string;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private locationStrategy: LocationStrategy
	) {
		this.subscription = router.events
			.subscribe((s: Event) => s instanceof NavigationEnd && this.updateTargetUrlAndHref());
	}

	ngOnChanges(changes: {}): any { this.updateTargetUrlAndHref(); }
	ngOnDestroy(): any { this.subscription.unsubscribe(); }

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
		return this.router.createUrlTree(this.commands, {
			relativeTo: this.route.root,
			queryParams: this.queryParams,
			fragment: this.fragment,
			queryParamsHandling: this.queryParamsHandling,
			preserveFragment: attrBoolValue(this.preserveFragment),
		});
	}
}


@Directive({
	// tslint:disable-next-line: directive-selector
	selector: ':not(a):not(area)[routerLinkRootOutlets]'
})
export class RouterLinkRootOutletsDirective {
	@Input()
	set routerLinkRootOutlets(outlets: Dictionary<any[]>) {
		if (!isObject(outlets))
			throw new Error('RouterLinkOutlets accepts only a dictionary where the keys are the outlet names and the values are the route commands');

		this.commands = [{ outlets }];
	}

	@Input() queryParams !: { [k: string]: any };

	@Input() fragment !: string;

	@Input() queryParamsHandling !: QueryParamsHandling;

	@Input() preserveFragment !: boolean;

	@Input() skipLocationChange !: boolean;

	@Input() replaceUrl !: boolean;

	@Input() state?: { [k: string]: any };

	private commands: any[] = [];

	private preserve !: boolean;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		// tslint:disable-next-line: no-attribute-decorator
		@Attribute('tabindex') tabIndex: string,
		renderer: Renderer2,
		el: ElementRef
	) {
		if (tabIndex === null)
			renderer.setAttribute(el.nativeElement, 'tabindex', '0');
	}

	@HostListener('click')
	onClick(): boolean {
		const extras = {
			skipLocationChange: attrBoolValue(this.skipLocationChange),
			replaceUrl: attrBoolValue(this.replaceUrl),
		};
		this.router.navigateByUrl(this.urlTree, extras);
		return true;
	}

	get urlTree(): UrlTree {
		return this.router.createUrlTree(this.commands, {
			relativeTo: this.route.root,
			queryParams: this.queryParams,
			fragment: this.fragment,
			preserveQueryParams: attrBoolValue(this.preserve),
			queryParamsHandling: this.queryParamsHandling,
			preserveFragment: attrBoolValue(this.preserveFragment),
		});
	}
}

function attrBoolValue(s: any): boolean {
	return s === '' || !!s;
}
