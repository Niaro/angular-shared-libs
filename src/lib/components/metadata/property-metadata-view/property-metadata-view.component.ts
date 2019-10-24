import { Component, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges, Renderer2, ElementRef, SimpleChange } from '@angular/core';

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

	@Input() compact = false;

	@Input() metadata!: PropertyMetadata;

	@Input() value: any;

	// @Input() color: ThemePalette;

	constructor(private renderer: Renderer2, private host: ElementRef) { }

	ngOnChanges({ metadata }: SimpleChanges) {
		metadata && this.setHostClass(metadata);
	}

	isInteger(value: number) {
		return Number.isInteger(value);
	}

	private setHostClass({ previousValue: prev, currentValue: curr }: SimpleChange) {
		prev && this.renderer.removeClass(this.host.nativeElement, this.getHostClass(prev));
		curr && this.renderer.addClass(this.host.nativeElement, this.getHostClass(curr));
	}

	private getHostClass(md: PropertyMetadata) {
		return `view-type-${md.viewType.cssClass}`;
	}
}
