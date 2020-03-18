import { FormControl, ValidatorFn, ValidationErrors, FormGroupDirective } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Input, ElementRef, Optional, SimpleChanges, OnChanges, ChangeDetectorRef, OnInit, Directive } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { auditTime, switchMap, filter } from 'rxjs/operators';
import { Subscription, iif, Subject } from 'rxjs';

import { OptionalBehaviorSubject } from '@bp/shared/rxjs';
import { lineMicrotask } from '@bp/shared/utils';

import { ControlComponent } from './control.component';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class FormFieldControlComponent<T> extends ControlComponent<T> implements OnChanges, OnInit {

	@Input() formControl!: FormControl;

	@Input() formControlName!: string;

	@Input() appearance: MatFormFieldAppearance | 'round' | 'none' = 'outline';

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
		return this.formControl || <FormControl> this.form?.controls[ this.formControlName ] || null;
	}

	get form() { return this._formGroupDirective && this._formGroupDirective.form; }

	externalControl$ = new OptionalBehaviorSubject<FormControl | null>();

	get $host() { return <HTMLElement> this._host.nativeElement; }

	get isFocused() {
		return this.$host === document.activeElement || this.$host.contains(document.activeElement);
	}

	protected _onWriteValue$ = new Subject<void>();

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
	}
	// #endregion Implementation of the ControlValueAccessor interface

	protected _validator: ValidatorFn | null = (): ValidationErrors | null => {
		return this.internalControl.invalid
			? { 'invalid': true }
			: null;
	};

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
				this.externalControl?.markAsDirty();
				this._onInternalControlValueChange(v);
			});
	}

	protected _reflectExternalControlOnInternal() {
		this.externalControl$
			.subscribe(external => this.internalControl.setValidators(external?.validator ?? null));

		this.externalControl$
			.pipe(
				filter(v => !!v),
				switchMap(v => v!.statusChanges),
			)
			.subscribe(() => {
				this.internalControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
				this._cdr.markForCheck();
			});
	}
}
