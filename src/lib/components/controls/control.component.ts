import { Output, Input, EventEmitter, HostBinding } from '@angular/core';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export abstract class ControlComponent<T> implements ControlValueAccessor, Validator {
	@Input() value: T;
	@Output() valueChange = new EventEmitter<T>();
	@HostBinding('class.control') isControl = true;

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

	registerOnChange(fn: (value: any) => {}): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => {}): void {
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
