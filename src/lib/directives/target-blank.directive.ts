import { Directive, Input, HostBinding, OnChanges, Self, Optional } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Directive({
	selector: 'a[bpTargetBlank]'
})
export class TargetBlankDirective implements OnChanges {
	@Input('rtTargetBlank') shouldSet: boolean | '' = true;
	@HostBinding('attr.target') get target() { return this.shouldSet ? '_blank' : null; }
	@HostBinding('attr.rel') get rel() { return this.shouldSet ? 'noopener' : null; }

	constructor(@Optional() @Self() private routerLink?: RouterLinkWithHref) { }

	ngOnChanges() {
		this.shouldSet = this.shouldSet === '' || !!this.shouldSet;
		if (this.routerLink)
			this.routerLink.target = this.target;
	}
}
