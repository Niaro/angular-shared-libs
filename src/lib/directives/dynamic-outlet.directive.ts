import { Directive, OnInit, OnDestroy, Input, ViewContainerRef, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, ChildrenOutletContexts } from '@angular/router';

@Directive({
	// tslint:disable-next-line: directive-selector
	selector: 'bp-dynamic-outlet',
	exportAs: 'outlet'
})
export class DynamicOutletDirective implements OnInit, OnDestroy {
	@Input() name!: string;
	outlet!: RouterOutlet;

	get isActivated() { return this.outlet && this.outlet.isActivated; }

	constructor(
		private parentContexts: ChildrenOutletContexts,
		private location: ViewContainerRef,
		private resolver: ComponentFactoryResolver,
		private changeDetector: ChangeDetectorRef,
	) { }

	ngOnInit() {
		this.outlet = new RouterOutlet(this.parentContexts, this.location, this.resolver, this.name, this.changeDetector);
		// tslint:disable-next-line:no-lifecycle-call
		this.outlet.ngOnInit();
	}

	ngOnDestroy() {
		// tslint:disable-next-line:no-lifecycle-call
		this.outlet && this.outlet.ngOnDestroy();
	}
}
