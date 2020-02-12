import { FormControl, ValidatorFn, ValidationErrors, FormGroupDirective } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Input, ElementRef, Optional, SimpleChanges, OnChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { auditTime, switchMap, filter } from 'rxjs/operators';
import { Subscription, iif } from 'rxjs';

import { OptionalBehaviorSubject } from '@bp/shared/rxjs';
import { lineMicrotask } from '@bp/shared/utils';

import { ControlComponent } from './control.component';

export abstract class FormFieldControlComponent<T> extends ControlComponent<T> implements OnChanges, OnInit {

	@Input() formControl!: FormControl;

	@Input() formControlName!: string;

	@Input() appearance: MatFormFieldAppearance | 'round' = 'outline';

	@Input() color: ThemePalette = 'primary';

	@Input() name!: string;

	@Input() placeholder!: string;

	@Input() label!: string;

	@Input() hint!: string;

	@Input() required!: boolean;

	@Input() throttle = 200;

	@Input() hideErrorText = false;

	internalControl = new FormControl();

	get externalControl(): FormControl | null {
		return this.formControl || this.form && <FormControl>this.form.controls[this.formControlName] || null;
	}

	get form() { return this._formGroupDirective && this._formGroupDirective.form; }

	externalControl$ = new OptionalBehaviorSubject<FormControl | null>();

	get $host() { return <HTMLElement>this._host.nativeElement; }

	get isFocused() {
		return this.$host === document.activeElement || this.$host.contains(document.activeElement);
	}

	private _updateSubscription = Subscription.EMPTY;

	constructor(
		protected _host: ElementRef,
		protected _cdr: ChangeDetectorRef,
		@Optional() private _formGroupDirective?: FormGroupDirective
	) {
		super(_cdr);
	}

	ngOnChanges({ formControl, formControlName, throttle, value }: SimpleChanges) {
		if (formControl || formControlName)
			this.externalControl$.next(this.externalControl);

		if (value)
			this.writeValue(this.value);

		if (throttle)
			this._listenToInternalControlValueChanges();
	}

	ngOnInit() {
		this._listenToInternalControlValueChanges();
		this._reflectExternalControlOnInternal();
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: T | null): void {
		lineMicrotask(() => {
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

	protected _validator: ValidatorFn | null = (): ValidationErrors | null => {
		return this.internalControl.invalid
			? { 'invalid': true }
			: null;
	}

	protected _onInternalControlValueChange(v: any) {
		this.setValue(v);
	}

	private _listenToInternalControlValueChanges() {
		this._updateSubscription.unsubscribe();
		this._updateSubscription = iif(
			() => !!this.throttle,
			this.internalControl.valueChanges.pipe(auditTime(this.throttle)),
			this.internalControl.valueChanges
		)
			.subscribe(v => {
				this.externalControl && this.externalControl.markAsDirty();
				this._onInternalControlValueChange(v);
			});
	}

	protected _reflectExternalControlOnInternal() {
		this.externalControl$
			.subscribe(external => this.internalControl.setValidators(external && external.validator));

		this.externalControl$
			.pipe(
				filter(v => !!v),
				switchMap(v => v!.statusChanges),
			)
			.subscribe(() => this._cdr.markForCheck());
	}
}
