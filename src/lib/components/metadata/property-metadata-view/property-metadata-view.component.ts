import { Component, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges, Renderer2, ElementRef } from '@angular/core';

import { PropertyMetadata, FieldViewType } from '@bp/shared/models';

@Component({
	selector: 'bp-property-metadata-view',
	templateUrl: './property-metadata-view.component.html',
	styleUrls: ['./property-metadata-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyMetadataViewComponent implements OnChanges {
	FieldViewType = FieldViewType;

	@Input() label = true;

	@Input() metadata!: PropertyMetadata;

	@Input() value: any;

	constructor(private renderer: Renderer2, private host: ElementRef) { }

	ngOnChanges({ metadata }: SimpleChanges) {
		if (metadata) {
			const prev: PropertyMetadata = metadata.previousValue;
			const curr: PropertyMetadata = metadata.currentValue;
			this.renderer.removeClass(this.host.nativeElement, prev && prev.viewType.cssClass);
			this.renderer.addClass(this.host.nativeElement, curr && curr.viewType.cssClass);
		}
	}

	isInteger(value: number) {
		return Number.isInteger(value);
	}
}
