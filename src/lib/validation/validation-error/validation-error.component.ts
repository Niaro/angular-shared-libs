import { Component, ChangeDetectionStrategy, Input, OnChanges, HostBinding } from '@angular/core';

import { SLIDE } from '@bp/shared/animations';

import { IValidationErrors } from '../models';
import { ValidationErrorStrings } from '../validation-error-strings';


@Component({
	selector: 'bp-validation-error',
	templateUrl: './validation-error.component.html',
	styleUrls: ['./validation-error.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [SLIDE]
})
export class ValidationErrorComponent implements OnChanges {
	@Input('errors') errors: IValidationErrors;
	@Input() controlName: string;
	@Input() animate = true;
	@HostBinding('class.mat-error') matError = true;

	error: string;

	ngOnChanges() {
		this.error = new ValidationErrorStrings(this.controlName, this.errors)[0];
	}
}
