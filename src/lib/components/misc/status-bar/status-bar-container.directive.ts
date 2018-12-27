import { Directive, ElementRef } from '@angular/core';

@Directive({
	selector: '[bpStatusBarContainer]'
})
export class StatusBarContainerDirective {
	get $host(): HTMLElement { return this.host.nativeElement; }

	constructor(private host: ElementRef) { }
}
