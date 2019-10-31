import { FormControl, ValidatorFn, ValidationErrors, FormGroupDirective } from '@angular/forms';
import { Input, ElementRef, Optional, SimpleChanges, OnChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { isEmpty } from 'lodash-es';
import { switchMap, map, auditTime } from 'rxjs/operators';
import { of, Subscription, iif } from 'rxjs';

import { OptionalBehaviorSubject } from '@bp/shared/rxjs';

import { ControlComponent } from './control.component';

export abstract class FormFieldControlComponent<T> extends ControlComponent<T> implements OnChanges, OnInit {
	@Input() formControl!: FormControl;

	@Input() formControlName!: string;

	@Input() appearance: MatFormFieldAppearance | 'round' = 'outline';

	@Input() name!: string;

	@Input() placeholder!: string;

	@Input() label!: string;

	@Input() hint!: string;

	@Input() required!: boolean;

	@Input() throttle = 200;

	internalControl = new FormControl();

	get externalControl(): FormControl | null {
		return this.formControl || this.form && this.form.controls[this.formControlName] as FormControl || null;
	}

	get form() { return this.formGroupDirective && this.formGroupDirective.form; }

	externalControl$ = new OptionalBehaviorSubject<FormControl | null>();

	private updateSubscription = Subscription.EMPTY;

	constructor(
		protected host: ElementRef,
		protected cdr: ChangeDetectorRef,
		@Optional() private formGroupDirective?: FormGroupDirective
	) {
		super(cdr);
	}

	ngOnChanges({ formControl, formControlName, throttle, value }: SimpleChanges) {
		if (formControl || formControlName)
			this.externalControl$.next(this.externalControl);

		if (value)
			this.writeValue(this.value);

		if (throttle)
			this.updateOnInternalControlValueChanges();
	}

	ngOnInit() {
		this.updateOnInternalControlValueChanges();
		this.rerouteExternalControlErrorsToInternalControl();
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: T): void {
		Promise
			.resolve()
			.then(() => {
				this.value = value;
				this.internalControl.setValue(value, { emitViewToModelChange: false });
			});
	}

	setDisabledState?(isDisabled: boolean) {
		if (isDisabled)
			this.internalControl.disable({ emitEvent: false });
		else
			this.internalControl.enable({ emitEvent: false });
	}
	// #endregion Implementation of the ControlValueAccessor interface

	protected validator: ValidatorFn | null = (): ValidationErrors | null => {
		return this.internalControl.invalid
			? { 'invalid': true }
			: null;
	}

	private updateOnInternalControlValueChanges() {
		this.updateSubscription.unsubscribe();
		this.updateSubscription = iif(
			() => !!this.throttle,
			this.internalControl.valueChanges.pipe(auditTime(this.throttle)),
			this.internalControl.valueChanges
		)
			.subscribe(v => this.update(v));
	}

	private rerouteExternalControlErrorsToInternalControl() {
		this.externalControl$
			.pipe(
				switchMap(v => v
					? v.statusChanges.pipe(map(() => v.errors))
					: of(null)
				),
				map(errors => ({
					...this.internalControl.errors,
					...errors
				}))
			)
			.subscribe(errors => this.internalControl.setErrors(isEmpty(errors) ? null : errors));
	}
}
