import { Directive, ElementRef } from '@angular/core';

@Directive({
	selector: '[bpStatusBarContainer]'
})
export class StatusBarContainerDirective {
	get $host(): HTMLElement { return this._host.nativeElement; }

	constructor(private _host: ElementRef) { }
}
