import { Directive, ElementRef, Output } from '@angular/core';
import { TouchBuilder } from './touch-builder';
import { TouchManager } from './touch-manager';

@Directive({
	selector: '[bpRotate],[bpPinch],[bpSwipe],[bpDoubleTap],[bpLongTap],[bpSingleTap],[bpTap],[bpPan]'
})
export class TouchDirective {
	@Output('bpRotate') get rotate() { return this.touchManager.rotate$; }
	@Output('bpPinch') get pinch() { return this.touchManager.pinch$; }
	@Output('bpSwipe') get swipe() { return this.touchManager.swipe$; }
	@Output('bpDoubleTap') get doubleTap() { return this.touchManager.doubleTap$; }
	@Output('bpLongTap') get longTap() { return this.touchManager.longTap$; }
	@Output('bpSingleTap') get singleTap() { return this.touchManager.singleTap$; }
	@Output('bpTap') get tap() { return this.touchManager.tap$; }
	@Output('bpPan') get pan() { return this.touchManager.pan$; }

	private touchManager: TouchManager;

	constructor(private host: ElementRef, private touchBuilder: TouchBuilder) {
		this.touchManager = this.touchBuilder.build(this.host.nativeElement);
	}
}
