import { isEqual } from 'lodash-es';
import { of } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import {
	AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, Optional,
	SimpleChanges
} from '@angular/core';
import { AbstractControl, AbstractControlDirective, FormGroupDirective, ValidationErrors } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';

import { OptionalBehaviorSubject } from '@bp/shared/rxjs';

@Component({
	// tslint:disable-next-line:component-selector
	selector: '[bpFieldError]',
	templateUrl: './field-error.component.html',
	styleUrls: [ './field-error.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldErrorComponent implements OnChanges, AfterViewInit {

	@Input('bpFieldError') formControlOrName!: AbstractControl | string;

	@Input('bpFieldErrorSuppress') suppress = false;

	errors$ = new OptionalBehaviorSubject<ValidationErrors | null>();

	private _formControl$ = new OptionalBehaviorSubject<AbstractControl | AbstractControlDirective | null>();

	private get _form() { return this._formGroupDirective && this._formGroupDirective.form; }

	constructor(
		@Optional() private _formField?: MatFormField,
		@Optional() private _formGroupDirective?: FormGroupDirective
	) {
		this._formControl$
			.pipe(
				switchMap(v => v && v.statusChanges
					? v.statusChanges.pipe(map(() => v.errors))
					: of(null)
				),
				distinctUntilChanged(isEqual)
			)
			.subscribe(errors => this.errors$.next(errors));
	}

	ngOnChanges({ formControlOrName }: SimpleChanges) {
		formControlOrName && this._formControl$.next(this.formControlOrName instanceof AbstractControl
			? this.formControlOrName
			: this._form && this._form.controls[ this.formControlOrName ] || null
		);
	}

	ngAfterViewInit() {
		this._formField && this._formControl$.next(this._formField._control.ngControl);
	}
}
