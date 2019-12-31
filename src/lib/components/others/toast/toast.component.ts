import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';

import { TIMINGS, SEMI_SLOW, FADE } from '@bp/shared/animations';

@Component({
	selector: 'bp-toast',
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		FADE,
		trigger('flyInOut', [
			state('inactive', style({
				opacity: 0,
			})),
			transition('inactive => active', animate(TIMINGS, keyframes([
				style({
					transform: 'translate3d(100%, 0, 0)',
					opacity: 0,
				}),
				style({
					transform: 'none',
					opacity: 1,
				}),
			])), SEMI_SLOW),
			transition('active => removed', animate(TIMINGS, keyframes([
				style({
					opacity: 1,
				}),
				style({
					transform: 'translate3d(100%, 0, 0)',
					opacity: 0,
				}),
			])), SEMI_SLOW),
		]),
	],
})
export class ToastComponent extends Toast {

	constructor(
		protected toasterService: ToastrService,
		public toasterPackage: ToastPackage,
		private cdr: ChangeDetectorRef
	) {
		super(toasterService, toasterPackage);
	}

	updateProgress() {
		super.updateProgress();
		this.cdr.detectChanges();
	}
}
