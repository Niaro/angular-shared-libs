import { Directive, ElementRef, OnDestroy, Output } from '@angular/core';

import { TouchBuilder } from './touch-builder';

@Directive({
	selector: '[bpRotate],[bpPinch],[bpSwipe],[bpDoubleTap],[bpLongTap],[bpSingleTap],[bpTap],[bpPan]'
})
export class TouchDirective implements OnDestroy {

	private _touchManager = this._touchBuilder.build(this._host.nativeElement)!;

	@Output('bpRotate') readonly rotate$ = this._touchManager.rotate$;

	@Output('bpPinch') readonly pinch$ = this._touchManager.pinch$;

	@Output('bpSwipe') readonly swipe$ = this._touchManager.swipe$;

	@Output('bpDoubleTap') readonly doubleTap$ = this._touchManager.doubleTap$;

	@Output('bpLongTap') readonly longTap$ = this._touchManager.longTap$;

	@Output('bpSingleTap') readonly singleTap$ = this._touchManager.singleTap$;

	@Output('bpTap') readonly tap$ = this._touchManager.tap$;

	@Output('bpPan') readonly pan$ = this._touchManager.pan$;

	constructor(
		private _host: ElementRef,
		private _touchBuilder: TouchBuilder
	) { }

	ngOnDestroy() {
		this._touchManager.destroy();
	}

}
