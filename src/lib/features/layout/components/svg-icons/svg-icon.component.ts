import { Component, Input, ChangeDetectionStrategy, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Component({
	selector: 'bp-svg-icon',
	templateUrl: './svg-icon.component.html',
	styleUrls: ['./svg-icon.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgIconComponent implements OnChanges {
	@Input() name: String;

	private get $host() { return this.host.nativeElement; }

	constructor(private host: ElementRef, private renderer: Renderer2) { }

	ngOnChanges({ name }: SimpleChanges) {
		this.renderer.removeClass(this.$host, name.previousValue);
		this.renderer.addClass(this.$host, name.currentValue);
	}
}
