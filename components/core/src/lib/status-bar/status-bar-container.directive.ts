import { Directive, ElementRef } from '@angular/core';

@Directive({
	selector: '[bpStatusBarContainer]'
})
export class StatusBarContainerDirective {

	$host: HTMLElement = this._host.nativeElement;

	constructor(private _host: ElementRef) { }

}
