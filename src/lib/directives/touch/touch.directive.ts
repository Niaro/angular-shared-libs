import { Directive, ElementRef, Output } from '@angular/core';
import { TouchBuilder, TouchManager } from './touch';

@Directive({
	selector: '[rtMultitouchStart],[rtMultitouchEnd],[rtRotate],[rtPinch],[rtSwipe],[rtDoubleTap],[rtLongTap],[rtSingleTap],[rtTap],[rtPan]'
})
export class TouchDirective {
	@Output('rtRotate') get rotate() { return this.touchManager.rotate$; }
	@Output('rtPinch') get pinch() { return this.touchManager.pinch$; }
	@Output('rtSwipe') get swipe() { return this.touchManager.swipe$; }
	@Output('rtDoubleTap') get doubleTap() { return this.touchManager.doubleTap$; }
	@Output('rtLongTap') get longTap() { return this.touchManager.longTap$; }
	@Output('rtSingleTap') get singleTap() { return this.touchManager.singleTap$; }
	@Output('rtTap') get tap() { return this.touchManager.tap$; }
	@Output('rtPan') get pan() { return this.touchManager.pan$; }

	private touchManager: TouchManager;

	constructor(private host: ElementRef, private touchBuilder: TouchBuilder) {
		this.touchManager = this.touchBuilder.build(this.host.nativeElement);
	}
}