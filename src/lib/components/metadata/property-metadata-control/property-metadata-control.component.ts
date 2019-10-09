import { Component, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges, Renderer2, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';

import { NumberMaskConfig } from '@bp/shared/directives';
import { PropertyMetadata, FieldControlType } from '@bp/shared/models';

@Component({
	selector: 'bp-property-metadata-control',
	templateUrl: './property-metadata-control.component.html',
	styleUrls: ['./property-metadata-control.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyMetadataControlComponent implements OnChanges {
	FieldControlType = FieldControlType;

	@Input() metadata!: PropertyMetadata;

	@Input() control!: FormControl;

	@Input() appearance: MatFormFieldAppearance = 'outline';

	numberMask = new NumberMaskConfig({
		placeholderChar: '\u2000', // whitespace
		allowDecimal: true,
		decimalLimit: 2,
		guide: false,
		maskOnFocus: true
	});

	constructor(private renderer: Renderer2, private host: ElementRef) { }

	ngOnChanges({ metadata }: SimpleChanges) {
		if (metadata) {
			const prev: PropertyMetadata = metadata.previousValue;
			const curr: PropertyMetadata = metadata.currentValue;
			this.renderer.removeClass(this.host.nativeElement, prev && prev.control.type.cssClass);
			this.renderer.addClass(this.host.nativeElement, curr && curr.control.type.cssClass);
		}
	}
}
