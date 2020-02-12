import { Component, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges, Renderer2, ElementRef, SimpleChange } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { ThemePalette } from '@angular/material/core';

import { PropertyMetadata, FieldControlType } from '@bp/shared/models';
import { Validators } from '@bp/shared/validation';

@Component({
	selector: 'bp-property-metadata-control',
	templateUrl: './property-metadata-control.component.html',
	styleUrls: ['./property-metadata-control.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyMetadataControlComponent implements OnChanges {

	// tslint:disable-next-line: naming-convention
	FieldControlType = FieldControlType;

	@Input() metadata!: PropertyMetadata;

	@Input() control!: FormControl;

	@Input() appearance: MatFormFieldAppearance = 'outline';

	@Input() color: ThemePalette = 'primary';

	get mdControl() { return this.metadata?.control; }

	constructor(
		private _renderer: Renderer2,
		private _host: ElementRef
	) { }

	ngOnChanges({ metadata, control }: SimpleChanges) {
		metadata && this._setHostClass(metadata);

		if ((metadata || control) && this.metadata.control.validator)
			this._setMetadataValidators();
	}

	private _setMetadataValidators() {
		this.control.setValidators(Validators.compose(
			[this.control.validator, this.metadata.control.validator]
		));
	}

	private _setHostClass({ previousValue: prev, currentValue: curr }: SimpleChange) {
		prev && this._renderer.removeClass(this._host.nativeElement, this._getHostClass(prev));
		curr && this._renderer.addClass(this._host.nativeElement, this._getHostClass(curr));
	}

	private _getHostClass(md: PropertyMetadata) {
		return `control-type-${md.control.type.cssClass}`;
	}
}
