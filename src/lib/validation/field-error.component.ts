import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { head } from 'lodash-es';

import { ValidationErrorStrings } from './validation-error-strings';

@Component({
	// tslint:disable-next-line:component-selector
	selector: '[bpFieldError]',
	template: '{{ error$ | async }}',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldErrorComponent implements OnInit {
	error$: Observable<string>;
	private get control() {
		return this.formField._control.ngControl;
	}

	constructor(private formField: MatFormField) {}

	ngOnInit() {
		this.error$ = this.control.statusChanges.pipe(
			startWith(null),
			map(() => new ValidationErrorStrings(this.control.name, this.control.errors)),
			map(errors => head(errors))
		);
	}
}
