import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { MatFormField } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { head } from 'lodash-es';

import { ValidationErrorStrings } from './validation-error-strings';
import { FormControl, FormGroupDirective } from '@angular/forms';

@Component({
	// tslint:disable-next-line:component-selector
	selector: '[bpFieldError]',
	template: '{{ error$ | async }}',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldErrorComponent implements OnInit {
	@Input('bpFieldError') formControlName: string;

	error$: Observable<string>;

	private get control() {
		return this.formControlName
			? this.formGroup.directives.find(v => v.name === this.formControlName)
			: this.formField._control.ngControl;
	}

	constructor(
		private formField: MatFormField,
		private formGroup: FormGroupDirective
	) { }

	ngOnInit() {
		this.error$ = this.control.statusChanges.pipe(
			startWith(null),
			map(() => new ValidationErrorStrings(this.control.name, this.control.errors)),
			map(errors => head(errors))
		);
	}
}
