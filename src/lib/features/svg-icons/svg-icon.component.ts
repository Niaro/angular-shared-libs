import { Component, Input, ChangeDetectionStrategy, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Component({
	selector: 'bp-svg-icon',
	templateUrl: './svg-icon.component.html',
	styleUrls: ['./svg-icon.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgIconComponent implements OnChanges {

	@Input() name!: String;

	private get _$host() { return this._host.nativeElement; }

	constructor(
		private _host: ElementRef,
		private _renderer: Renderer2
	) { }

	ngOnChanges({ name }: SimpleChanges) {
		this._renderer.removeClass(this._$host, name.previousValue);
		this._renderer.addClass(this._$host, name.currentValue);
	}

}
