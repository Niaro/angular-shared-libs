import { Component, Input, OnChanges, AfterViewInit, SimpleChanges, ChangeDetectionStrategy, Optional } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { isEqual } from 'lodash-es';
import { AbstractControl, ValidationErrors, FormGroupDirective, AbstractControlDirective } from '@angular/forms';
import { switchMap, distinctUntilChanged, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { OptionalBehaviorSubject } from '@bp/shared/rxjs';

@Component({
	// tslint:disable-next-line:component-selector
	selector: '[bpFieldError]',
	templateUrl: './field-error.component.html',
	styleUrls: ['./field-error.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldErrorComponent implements OnChanges, AfterViewInit {

	@Input('bpFieldError') formControlOrName!: AbstractControl | string;

	@Input('bpFieldErrorSuppress') suppress = false;

	errors$ = new OptionalBehaviorSubject<ValidationErrors | null>();

	formControl$ = new OptionalBehaviorSubject<AbstractControl | AbstractControlDirective | null>();

	get form() { return this.formGroupDirective && this.formGroupDirective.form; }

	constructor(
		@Optional() private formField?: MatFormField,
		@Optional() private formGroupDirective?: FormGroupDirective
	) {
		this.formControl$
			.pipe(
				switchMap(v => v && v.statusChanges
					? v.statusChanges.pipe(map(() => v.errors))
					: of(null)
				),
				distinctUntilChanged((a, b) => isEqual(a, b))
			)
			.subscribe(errors => this.errors$.next(errors));
	}

	ngOnChanges({ formControlOrName }: SimpleChanges) {
		formControlOrName && this.formControl$.next(this.formControlOrName instanceof AbstractControl
			? this.formControlOrName
			: this.form && this.form.controls[this.formControlOrName] || null
		);
	}

	ngAfterViewInit() {
		this.formField && this.formControl$.next(this.formField._control.ngControl);
	}
}
