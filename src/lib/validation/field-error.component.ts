import { Component, ChangeDetectionStrategy, Input, Optional } from '@angular/core';
import { MatFormField } from '@angular/material';
import { FormGroupDirective, NgControl } from '@angular/forms';

@Component({
	// tslint:disable-next-line:component-selector
	selector: '[bpFieldError]',
	template: `
		<bp-validation-error [errors]="control.errors" [controlName]="controlName" [animate]="false"></bp-validation-error>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
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
		private formGroup: FormGroupDirective,
		@Optional() private formField?: MatFormField
	) { }
}
