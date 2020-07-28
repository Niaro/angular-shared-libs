import { ChangeDetectorRef, ComponentFactoryResolver, Directive, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';

@Directive({
	// tslint:disable-next-line: directive-selector
	selector: 'bp-dynamic-outlet',
	exportAs: 'outlet'
})
export class DynamicOutletDirective implements OnInit, OnDestroy {

	@Input() name!: string;

	ngOutlet!: RouterOutlet;

	get isActivated() { return this.ngOutlet?.isActivated; }

	get component() { return this.ngOutlet?.component; }

	get activatedRouteData() { return this.ngOutlet?.activatedRouteData; }

	constructor(
		private _parentContexts: ChildrenOutletContexts,
		private _location: ViewContainerRef,
		private _resolver: ComponentFactoryResolver,
		private _changeDetector: ChangeDetectorRef,
	) { }

	ngOnInit() {
		this.ngOutlet = new RouterOutlet(this._parentContexts, this._location, this._resolver, this.name, this._changeDetector);
		// tslint:disable-next-line:no-lifecycle-call
		this.ngOutlet.ngOnInit();
	}

	ngOnDestroy() {
		// tslint:disable-next-line:no-lifecycle-call
		this.ngOutlet?.ngOnDestroy();
	}
}
