import { AbstractControl, ValidatorFn, AsyncValidatorFn } from '@angular/forms';

import { isString, isRegExp, merge, keys, isNil } from 'lodash-es';
import { IValidationErrors } from './models';

/**
 * Provides a set of custom validators.
 *
 * A validator is a function that processes a {@link FormControl} or collection of
 * controls and returns a map of errors. A null map means that validation has passed.
 *
 * ### Example
 *
 * ```typescript
 * var loginControl = new FormControl("", Validators.required)
 * ```
 */
export class Validators {
	/**
	 * Validator that requires controls to have a non-empty and without whitespaces value.
	 */
	static required(c: AbstractControl): IValidationErrors | null {
		return Validators.isEmptyValue(c.value) || (isString(c.value) && !c.value.trim())
			? { required: null }
			: null;
	}

	static digits(c: AbstractControl): IValidationErrors | null {
		if (Validators.isEmptyValue(c.value)) return null; // don't validate empty values to allow optional controls

		return isNaN(+c.value) ? { digits: null } : null;
	}

	/**
	 * Validator that requires controls to have a value of a minimum possible value.
	 */
	static minimum(required: number): ValidatorFn {
		return (c: AbstractControl): IValidationErrors | null => {
			if (this.isEmptyValue(c.value)) return null; // don't validate empty values to allow optional controls

			const actual = +c.value ? +c.value : 0;
			return actual < required ? { minimum: { required, actual } } : null;
		};
	}

	/**
	 * Validator that requires controls to have a value of a maximum possible value.
	 */
	static maximum(required: number): ValidatorFn {
		return ({ value }: AbstractControl): IValidationErrors | null => {
			if (this.isEmptyValue(value)) return null; // don't validate empty values to allow optional controls

			const actual = +value ? +value : 0;
			return actual > required ? { maximum: { required, actual } } : null;
		};
	}

	/**
	 * Validator that requires controls to have a value of a minimum length.
	 */
	static minLength(required: number): ValidatorFn {
		return ({ value }: AbstractControl): IValidationErrors | null => {
			if (this.isEmptyValue(value)) return null; // don't validate empty values to allow optional controls

			const actual = isString(value) ? value.length : 0;
			return actual < required ? { minLength: { required, actual } } : null;
		};
	}

	/**
	 * Validator that requires controls to have a value of a maximum length.
	 */
	static maxLength(required: number): ValidatorFn {
		return ({ value }: AbstractControl): IValidationErrors | null => {
			if (this.isEmptyValue(value)) return null; // don't validate empty values to allow optional controls

			const actual = isString(value) ? value.length : 0;
			return actual > required ? { maxLength: { required, actual } } : null;
		};
	}

	static excessSafeNumber(enabled: boolean): ValidatorFn {
		const MAX_SAFE_NUMBER_VALUE = 999999999999.99;

		return ({ value }: AbstractControl): IValidationErrors | null =>
			enabled && value > MAX_SAFE_NUMBER_VALUE ? { excessSafeNumber: null } : null;
	}

	/**
	 * Validator that requires a control to match a regex to its value.
	 */
	static pattern(pattern: string | RegExp): ValidatorFn {
		const regex = isRegExp(pattern) ? pattern : new RegExp(pattern);

		return ({ value }: AbstractControl): IValidationErrors | null => {
			if (this.isEmptyValue(value)) return null; // don't validate empty values to allow optional controls

			return regex.test(value)
				? null
				: { pattern: { required: regex.source, actual: value } };
		};
	}

	/**
	 * No-op validator.
	 */
	static nullValidator(): ValidatorFn {
		return (): IValidationErrors | null => null;
	}

	/**
	 * Compose multiple validators into a single function that returns the union
	 * of the individual error maps.
	 */
	static compose(validators: ValidatorFn[]): ValidatorFn {
		if (!validators) return null;
		const presentValidators = validators.filter(v => v !== null);
		if (this.isEmptyValue(presentValidators)) return null;

		return (control: AbstractControl) =>
			this.mergeErrors(this.executeValidators(control, presentValidators));
	}

	static composeAsync(validators: AsyncValidatorFn[]): AsyncValidatorFn {
		if (!validators) return null;
		const presentValidators = validators.filter(v => v != null);
		if (this.isEmptyValue(presentValidators)) return null;

		return (control: AbstractControl) => {
			const promises = this.executeAsyncValidators(control, presentValidators).map(
				this.convertToPromise
			);
			return Promise.all(promises).then(this.mergeErrors);
		};
	}

	static isEmptyValue(value: any) {
		return isNil(value) || value === '';
	}

	private static convertToPromise(obj: any): Promise<any> {
		return !!obj && typeof obj.then === 'function' ? obj : obj(obj);
	}

	private static executeValidators(control: AbstractControl, validators: ValidatorFn[]): any[] {
		return validators.map(v => v(control));
	}

	private static executeAsyncValidators(
		control: AbstractControl,
		validators: AsyncValidatorFn[]
	): any[] {
		return validators.map(v => v(control));
	}

	private static mergeErrors(arrayOfErrors: any[]): IValidationErrors | null {
		const result = arrayOfErrors.reduce(
			(accumulator: IValidationErrors | null, errors: IValidationErrors | null) =>
				errors === null ? accumulator : merge(accumulator),
			{}
		);
		return keys(result).length === 0 ? null : result;
	}
}
