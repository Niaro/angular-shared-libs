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
		return this.formControl || this.form && this.form.controls[this.formControlName] as FormControl || null;
	}

	get form() { return this.formGroupDirective && this.formGroupDirective.form; }

	externalControl$ = new OptionalBehaviorSubject<FormControl | null>();

	get $host() { return <HTMLElement>this.host.nativeElement; }

	get isFocused() {
		return this.$host === document.activeElement || this.$host.contains(document.activeElement);
	}

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
			this.listenToInternalControlValueChanges();
	}

	ngOnInit() {
		this.listenToInternalControlValueChanges();
		this.reflectExternalControlOnInternal();
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

	protected validator: ValidatorFn | null = (): ValidationErrors | null => {
		return this.internalControl.invalid
			? { 'invalid': true }
			: null;
	};

	protected onInternalControlValueChange(v: any) {
		this.setValue(v);
	}

	private listenToInternalControlValueChanges() {
		this.updateSubscription.unsubscribe();
		this.updateSubscription = iif(
			() => !!this.throttle,
			this.internalControl.valueChanges.pipe(auditTime(this.throttle)),
			this.internalControl.valueChanges
		)
			.subscribe(v => {
				this.externalControl && this.externalControl.markAsDirty();
				this.onInternalControlValueChange(v);
			});
	}

	protected reflectExternalControlOnInternal() {
		this.externalControl$
			.subscribe(external => this.internalControl.setValidators(external && external.validator));

		this.externalControl$
			.pipe(
				filter(v => !!v),
				switchMap(v => v!.statusChanges),
			)
			.subscribe(() => this.cdr.markForCheck());
	}
}
