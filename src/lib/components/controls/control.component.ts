import { Output, Input, HostBinding, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isNil, isEqual } from 'lodash-es';

export abstract class ControlComponent<T = any> implements ControlValueAccessor, Validator, OnDestroy {

	@Input() value!: T;

	@Output() readonly valueChange = new Subject<T>();

	@HostBinding('class.control') isControl = true;

	@HostBinding('class.empty') get empty() { return isNil(this.value) || (<any>this.value) === ''; }

	protected validator!: ValidatorFn | null;

	protected destroyed$ = new Subject();

	constructor(protected cdr: ChangeDetectorRef) { }

	ngOnDestroy() {
		this.destroyed$.next();
	}

	validatorOnChange = () => { };

	/** `View -> model callback called when value changes` */
	onChange: (value: any) => void = () => { };

	/** `View -> model callback called when input has been touched` */
	onTouched = () => { };

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: T): void {
		Promise
			.resolve()
			.then(() => {
				this.value = value;
				this.cdr.markForCheck();
			});
	}

	registerOnChange(fn: (value: any) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}
	// #endregion Implementation of the ControlValueAccessor interface

	// #region Implementation of the Validator interface
	registerOnValidatorChange?(fn: () => void): void {
		this.validatorOnChange = fn;
	}

	validate(c: AbstractControl): ValidationErrors | null {
		return this.validator ? this.validator(c) : null;
	}
	// #endregion Implementation of the Validator interface

	setValue(value: T, { emitChange }: { emitChange: boolean } = { emitChange: true }) {
		if (isEqual(value, this.value)) {
			this.validatorOnChange();
			return;
		}

		this.value = value as T;

		if (emitChange) {
			this.valueChange.next(value as T);
			this.onChange(value);
		}

		this.validatorOnChange();
		this.cdr.markForCheck();
	}

}
