import { isEmpty } from 'lodash-es';
import { Subject, Subscription } from 'rxjs';
import { auditTime, debounceTime, filter, switchMap } from 'rxjs/operators';

import { ChangeDetectorRef, Directive, ElementRef, Input, OnChanges, OnInit, Optional, SimpleChanges } from '@angular/core';
import { FormControl, FormGroupDirective, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { FloatLabelType, MatFormFieldAppearance } from '@angular/material/form-field';

import { OptionalBehaviorSubject } from '@bp/shared/rxjs';
import { lineMicrotask } from '@bp/shared/utilities';

import { ControlComponent } from './control.component';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class FormFieldControlComponent<T> extends ControlComponent<T> implements OnChanges, OnInit {

	@Input() formControl!: FormControl;

	@Input() formControlName!: string;

	@Input() appearance: MatFormFieldAppearance | 'round' | 'none' | 'custom' = 'outline';

	@Input() floatLabel?: FloatLabelType;

	@Input() color: ThemePalette = 'primary';

	@Input() name!: string;

	@Input() placeholder!: string;

	@Input() label!: string;

	@Input() hint!: string;

	@Input() required!: boolean | null;

	@Input() disabled!: boolean | null;

	@Input() throttle: number | '' = 200;

	@Input() debounce: number | '' = 0;

	@Input() hideErrorText = false;

	internalControl = new FormControl();

	get externalControl(): FormControl | null {
		return this.formControl || <FormControl> this.form?.controls[ this.formControlName ] || null;
	}

	get form() { return this._formGroupDirective && this._formGroupDirective.form; }

	externalControl$ = new OptionalBehaviorSubject<FormControl | null>();

	$host: HTMLElement = this._host.nativeElement;

	get isFocused() {
		return this.$host === document.activeElement || this.$host.contains(document.activeElement);
	}

	protected _onWriteValue$ = new Subject<void>();

	private _updateSubscription = Subscription.EMPTY;

	private readonly _throttleTime = 200;

	private readonly _debounceTime = 400;

	constructor(
		protected _host: ElementRef,
		protected _cdr: ChangeDetectorRef,
		@Optional() private _formGroupDirective?: FormGroupDirective
	) {
		super(_cdr);
	}

	ngOnChanges({ formControl, formControlName, throttle, debounce, value }: SimpleChanges) {
		if (formControl || formControlName)
			this.externalControl$.next(this.externalControl);

		if (value)
			this.writeValue(this.value);

		if (throttle && this.throttle === '')
			this.throttle = this._throttleTime;

		if (debounce && this.debounce === '')
			this.debounce = this._debounceTime;

		if (throttle || debounce)
			this._listenToInternalControlValueChanges();
	}

	ngOnInit() {
		this._listenToInternalControlValueChanges();
		this._reflectExternalControlOnInternal();
	}

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: T | null): void {
		lineMicrotask(() => {
			this._setIncomingValue(value);
			this._setIncomingValueToInternalControl(value);
			this._onWriteValue$.next();
		});
	}

	protected _setIncomingValue(value: T | null) {
		this.setValue(value!, { emitChange: false });
	}

	protected _setIncomingValueToInternalControl<U = T>(value: U | null) {
		this.internalControl.setValue(value, { emitEvent: false });
	}

	setDisabledState?(isDisabled: boolean) {
		if (isDisabled)
			this.internalControl.disable({ emitEvent: false });
		else
			this.internalControl.enable({ emitEvent: false });

		this._cdr.detectChanges();
	}
	// #endregion Implementation of the ControlValueAccessor interface

	protected _validator: ValidatorFn | null = (): ValidationErrors | null => {
		return this.internalControl.invalid
			? { invalid: true }
			: null;
	};

	protected _onInternalControlValueChange(v: any) {
		this.setValue(v);
	}

	private _listenToInternalControlValueChanges() {
		this._updateSubscription.unsubscribe();
		this._updateSubscription = (
			this.debounce
				? this.internalControl.valueChanges.pipe(debounceTime(this.debounce))
				: this.throttle
					? this.internalControl.valueChanges.pipe(auditTime(this.throttle))
					: this.internalControl.valueChanges
		)
			.subscribe(v => {
				this.externalControl?.markAsDirty();
				this._onInternalControlValueChange(v);
			});
	}

	protected _reflectExternalControlOnInternal() {
		// this.externalControl$
		// 	.subscribe(external => this.internalControl.setValidators(external?.validator ?? null));

		this.externalControl$
			.pipe(
				filter(v => !!v),
				switchMap(v => v!.statusChanges),
			)
			.subscribe(() => {

				this.internalControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });

				const errors = {
					...this.externalControl?.errors,
					...this.internalControl?.errors
				};
				this.internalControl.setErrors(isEmpty(errors) ? null : errors);
				this._cdr.markForCheck();
			});
	}
}
