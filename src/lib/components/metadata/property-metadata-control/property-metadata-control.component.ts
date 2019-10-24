import { Component, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges, Renderer2, ElementRef, SimpleChange } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { ThemePalette } from '@angular/material/core';

import { NumberMaskConfig } from '@bp/shared/directives';
import { PropertyMetadata, FieldControlType } from '@bp/shared/models';
import { Validators } from '@bp/shared/validation';

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

	@Input() color: ThemePalette = 'primary';

	numberMask = new NumberMaskConfig({
		placeholderChar: '\u2000', // whitespace
		allowDecimal: true,
		decimalLimit: 2,
		guide: false,
		maskOnFocus: true
	});

	constructor(private renderer: Renderer2, private host: ElementRef) { }

	ngOnChanges({ metadata, control }: SimpleChanges) {
		metadata && this.setHostClass(metadata);

		if ((metadata || control) && this.metadata.control.validator)
			this.setMetadataValidators();
	}

	private setMetadataValidators() {
		this.control.setValidators(Validators.compose(
			[this.control.validator, this.metadata.control.validator]
		));
	}

	private setHostClass({ previousValue: prev, currentValue: curr }: SimpleChange) {
		prev && this.renderer.removeClass(this.host.nativeElement, this.getHostClass(prev));
		curr && this.renderer.addClass(this.host.nativeElement, this.getHostClass(curr));
	}

	private getHostClass(md: PropertyMetadata) {
		return `control-type-${md.control.type.cssClass}`;
	}
}
