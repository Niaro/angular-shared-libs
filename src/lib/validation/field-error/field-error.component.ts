import { Component, Input, Optional } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { FormGroupDirective, NgControl } from '@angular/forms';

// tslint:disable-next-line: prefer-on-push-component-change-detection
@Component({
	// tslint:disable-next-line:component-selector
	selector: '[bpFieldError]',
	templateUrl: './field-error.component.html',
	styleUrls: ['./field-error.component.scss'],
})
export class FieldErrorComponent {
	@Input('bpFieldError') formControlName: string;

	get control() {
		return this.formControlName
			? this.formGroup.control.controls[this.formControlName]
			: this.formField._control.ngControl;
	}

	get controlName() {
		return this.control instanceof NgControl ? this.control.name : this.formControlName;
	}

	constructor(
		@Optional() private formGroup?: FormGroupDirective,
		@Optional() private formField?: MatFormField
	) { }
}
