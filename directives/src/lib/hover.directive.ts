import { BehaviorSubject } from 'rxjs';

import { Directive, HostListener, Output } from '@angular/core';

@Directive({
	selector: '[bpHover]'
})
export class HoverDirective {

	@Output('bpHover') readonly bpHover$ = new BehaviorSubject(false);

	@HostListener('mouseenter')
	onEnter() {
		this.bpHover$.next(true);
	}

	@HostListener('mouseleave')
	onLeave() {
		this.bpHover$.next(false);
	}
}
