import { Directive, Input, HostBinding, OnChanges, Self, Optional } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Directive({
	selector: 'a[bpTargetBlank]'
})
export class TargetBlankDirective implements OnChanges {
	// tslint:disable-next-line: no-input-prefix
	@Input('rtTargetBlank') shouldSet: boolean | '' = true;

	@HostBinding('attr.target') get target() { return this.shouldSet ? '_blank' : '_self'; }

	@HostBinding('attr.rel') get rel() { return this.shouldSet ? 'noopener' : null; }

	constructor(@Optional() @Self() private _routerLink?: RouterLinkWithHref) { }

	ngOnChanges() {
		this.shouldSet = this.shouldSet === '' || !!this.shouldSet;
		if (this._routerLink)
			this._routerLink.target = this.target;
	}
}
