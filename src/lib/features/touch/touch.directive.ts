import { Directive, ElementRef, Output, OnDestroy } from '@angular/core';
import { TouchBuilder } from './touch-builder';
import { TouchManager } from './touch-manager';

@Directive({
	selector: '[bpRotate],[bpPinch],[bpSwipe],[bpDoubleTap],[bpLongTap],[bpSingleTap],[bpTap],[bpPan]'
})
export class TouchDirective implements OnDestroy {

	private touchManager = this.touchBuilder.build(this.host.nativeElement) as TouchManager;

	@Output('bpRotate') readonly rotate$ = this.touchManager.rotate$;

	@Output('bpPinch') readonly pinch$ = this.touchManager.pinch$;

	@Output('bpSwipe') readonly swipe$ = this.touchManager.swipe$;

	@Output('bpDoubleTap') readonly doubleTap$ = this.touchManager.doubleTap$;

	@Output('bpLongTap') readonly longTap$ = this.touchManager.longTap$;

	@Output('bpSingleTap') readonly singleTap$ = this.touchManager.singleTap$;

	@Output('bpTap') readonly tap$ = this.touchManager.tap$;

	@Output('bpPan') readonly pan$ = this.touchManager.pan$;

	constructor(private host: ElementRef, private touchBuilder: TouchBuilder) { }

	ngOnDestroy() {
		this.touchManager.destroy();
	}

}
