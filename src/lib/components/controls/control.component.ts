import { Output, Input, EventEmitter, HostBinding } from '@angular/core';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isNil } from 'lodash-es';

export abstract class ControlComponent<T = any> implements ControlValueAccessor, Validator {
	@Input() value: T;
	@Output() valueChange = new EventEmitter<T>();
	@HostBinding('class.control') isControl = true;
	@HostBinding('class.empty') get empty() { return isNil(this.value); }

	protected validator: ValidatorFn | null;

	validatorOnChange = () => { };

	/** `View -> model callback called when value changes` */
	onChange: (value: any) => void = () => { };

	/** `View -> model callback called when input has been touched` */
	onTouched = () => { };

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: T): void {
		Promise
			.resolve()
			.then(() => this.value = value);
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
}
