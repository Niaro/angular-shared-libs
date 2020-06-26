import { IndividualConfig, Toast, ToastPackage, ToastrService } from 'ngx-toastr';

import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';

import { FADE, SEMI_SLOW, TIMINGS } from '@bp/shared/animations';

export type ToastConfig = IndividualConfig & { undoBtn: boolean; };

@Component({
	selector: 'bp-toast',
	templateUrl: './toast.component.html',
	styleUrls: [ './toast.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		FADE,
		trigger('flyInOut', [
			state('inactive', style({
				opacity: 0,
			})),
			transition(
				'inactive => active',
				animate(TIMINGS, keyframes([
					style({
						transform: 'translate3d(100%, 0, 0)',
						opacity: 0,
					}),
					style({
						transform: 'none',
						opacity: 1,
					}),
				])),
				SEMI_SLOW
			),
			transition(
				'active => removed',
				animate(
					TIMINGS,
					keyframes([
						style({
							opacity: 1,
						}),
						style({
							transform: 'translate3d(100%, 0, 0)',
							opacity: 0,
						}),
					])
				),
				SEMI_SLOW
			),
		]),
	],
})
export class ToastComponent extends Toast {

	options!: ToastConfig;

	undoBtnText = 'undo';

	constructor(
		public toasterPackage: ToastPackage,
		protected _toasterService: ToastrService,
		private _cdr: ChangeDetectorRef,
		zone: NgZone
	) {
		super(_toasterService, toasterPackage, zone);
	}

	updateProgress() {
		super.updateProgress();
		this._cdr.detectChanges();
	}

	undo(event: Event) {
		event.stopPropagation();
		this.undoBtnText = 'undid';
		this.toastPackage.triggerAction();

		return false;
	}
}
