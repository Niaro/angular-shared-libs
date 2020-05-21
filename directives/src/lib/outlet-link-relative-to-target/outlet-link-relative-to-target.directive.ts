import { Directive, Attribute, Renderer2, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { attrBoolValue } from '@bp/shared/utilities';

import { OutletLinkRelativeToTargetBaseDirective } from './outlet-link-relative-to-target-base.directive';

@Directive({
	// tslint:disable-next-line: directive-selector
	selector: ':not(a):not(area)[outletLinkRelativeToParent], :not(a):not(area)[outletLinkRelativeToRoot]'
})
export class OutletLinkRelativeToTargetDirective extends OutletLinkRelativeToTargetBaseDirective {

	constructor(
		router: Router,
		route: ActivatedRoute,
		// tslint:disable-next-line: no-attribute-decorator
		@Attribute('tabindex') tabIndex: string,
		renderer: Renderer2,
		el: ElementRef
	) {
		super(router, route);

		if (tabIndex === null)
			renderer.setAttribute(el.nativeElement, 'tabindex', '0');
	}

	@HostListener('click')
	onClick(): boolean {
		this._router.navigateByUrl(this._urlTree, {
			skipLocationChange: attrBoolValue(this.skipLocationChange),
			replaceUrl: attrBoolValue(this.replaceUrl),
		});
		return true;
	}

}
