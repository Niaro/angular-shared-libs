import { AbstractControl, ValidatorFn, AsyncValidatorFn, FormArray } from '@angular/forms';

import { isString, isRegExp, merge, keys, isNil, mapKeys, isEmpty } from 'lodash-es';
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
			? { required: true }
			: null;
	}

	/**
	* Validator that requires controls to have a non-empty and without whitespaces value.
	 * @param name name of the custom required message key
	 */
	static customRequired(name: string): ValidatorFn {
		return (c: AbstractControl): IValidationErrors | null => Validators.required(c)
			? { [`required-${name}`]: true }
			: null;
	}

	static noZero(c: AbstractControl): IValidationErrors | null {
		if (Validators.isEmptyValue(c.value)) return null; // don't validate empty values to allow optional controls

		return +c.value === 0
			? { noZero: true }
			: null;
	}

	static password(): ValidatorFn {
		const minLength = 8;
		const minLengthValidator = Validators.minLength(minLength);
		return (c: AbstractControl): IValidationErrors | null => {
			if (Validators.isEmptyValue(c.value)) return null; // don't validate empty values to allow optional controls
			const value = c.value as string;

			const minLengthValidation = minLengthValidator(c);
			if (minLengthValidation)
				return mapKeys(minLengthValidation, () => 'passwordMinLength');

			const letters = value.split('');
			const hasUpperCaseLetter = letters.some(v => v === v.toUpperCase() && v !== v.toLowerCase());
			const hasLowerCaseLetter = letters.some(v => v === v.toLowerCase() && v !== v.toUpperCase());
			const hasDigit = /\d/.test(value);
			const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

			return hasUpperCaseLetter && hasLowerCaseLetter && hasDigit && hasSpecialCharacter
				? null
				: { password: true };
		};
	}

	static confirmPassword(propName: string = 'password'): ValidatorFn {
		return (c: AbstractControl): IValidationErrors | null => {
			if (Validators.isEmptyValue(c.value)) return null; // don't validate empty values to allow optional controls

			if (c.parent instanceof FormArray)
				throw new Error('The confirm Password validator expects the control\'s parent to be a formGroup');

			return c.parent.controls[propName].value !== c.value
				? { passwordConfirm: true }
				: null;
		};
	}

	static digits(c: AbstractControl): IValidationErrors | null {
		if (Validators.isEmptyValue(c.value)) return null; // don't validate empty values to allow optional controls

		return isNaN(+c.value)
			? { digits: true }
			: null;
	}

	static letters(c: AbstractControl): IValidationErrors | null {
		if (Validators.isEmptyValue(c.value)) return null; // don't validate empty values to allow optional controls

		return c.value.match(/[$&+,:;=?@#|'<>.^*\(\)%\!\-\[\]\{\}\d]/g)
			? { letters: true }
			: null;
	}

	/**
	 * Validator that requires controls to have a value of a minimum possible value.
	 */
	static minimum(required: number): ValidatorFn {
		return (c: AbstractControl): IValidationErrors | null => {
			if (Validators.isEmptyValue(c.value)) return null; // don't validate empty values to allow optional controls

			const actual = +c.value ? +c.value : 0;
			return actual < required
				? { minimum: { required, actual } }
				: null;
		};
	}

	/**
	 * Validator that requires controls to have a value of a maximum possible value.
	 */
	static maximum(required: number): ValidatorFn {
		return ({ value }: AbstractControl): IValidationErrors | null => {
			if (Validators.isEmptyValue(value)) return null; // don't validate empty values to allow optional controls

			const actual = +value ? +value : 0;
			return actual > required
				? { maximum: { required, actual } }
				: null;
		};
	}

	/**
	 * Validator that requires controls to have a value of a minimum length.
	 */
	static minLength(required: number): ValidatorFn {
		return ({ value }: AbstractControl): IValidationErrors | null => {
			if (Validators.isEmptyValue(value)) return null; // don't validate empty values to allow optional controls

			const actual = isString(value) ? value.length : 0;
			return actual < required
				? { minlength: { required, actual } }
				: null;
		};
	}

	/**
	 * Validator that requires controls to have a value of a maximum length.
	 */
	static maxLength(required: number): ValidatorFn {
		return ({ value }: AbstractControl): IValidationErrors | null => {
			if (Validators.isEmptyValue(value)) return null; // don't validate empty values to allow optional controls

			const actual = isString(value) ? value.length : 0;
			return actual > required
				? { maxlength: { required, actual } }
				: null;
		};
	}

	static excessSafeNumber(enabled: boolean): ValidatorFn {
		const MAX_SAFE_NUMBER_VALUE = 999999999999.99;

		return ({ value }: AbstractControl): IValidationErrors | null =>
			enabled && value > MAX_SAFE_NUMBER_VALUE
				? { excessSafeNumber: true }
				: null;
	}

	static ip(c: AbstractControl): IValidationErrors | null {
		if (Validators.isEmptyValue(c.value)) return null; // don't validate empty values to allow optional controls

		return c.value.match(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g)
			? null
			: { ip: true };
	}

	static url(c: AbstractControl): IValidationErrors | null {
		if (Validators.isEmptyValue(c.value)) return null; // don't validate empty values to allow optional controls

		return c.value.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)
			? null
			: { url: true };
	}

	/**
	 * Validator that requires a control to match a regex to its value.
	 */
	static pattern(pattern: string | RegExp): ValidatorFn {
		const regex = isRegExp(pattern) ? pattern : new RegExp(pattern);

		return ({ value }: AbstractControl): IValidationErrors | null => {
			if (Validators.isEmptyValue(value)) return null; // don't validate empty values to allow optional controls

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
	static compose(validators: (ValidatorFn | null | undefined)[]): ValidatorFn | null {
		if (!validators)
			return null;

		const presentValidators = validators.filter(v => !isNil(v)) as ValidatorFn[];
		if (isEmpty(presentValidators))
			return null;

		return (control: AbstractControl) => Validators.mergeErrors(
			Validators.executeValidators(control, presentValidators)
		);
	}

	static composeAsync(validators: (AsyncValidatorFn | null | undefined)[]): AsyncValidatorFn | null {
		if (!validators)
			return null;

		const presentValidators = validators.filter(v => !isNil(v)) as AsyncValidatorFn[];

		if (isEmpty(presentValidators))
			return null;

		return (control: AbstractControl) => {
			const promises = Validators
				.executeAsyncValidators(control, presentValidators)
				.map(Validators.convertToPromise);

			return Promise.all(promises).then(Validators.mergeErrors);
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
				errors === null ? accumulator : merge(accumulator, errors),
			{}
		);
		return keys(result).length === 0 ? null : result;
	}
}
