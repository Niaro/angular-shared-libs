import { Output, Input, HostBinding, OnDestroy, ChangeDetectorRef, Directive } from '@angular/core';
import { Subject } from 'rxjs';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isNil, isEqual, uniq } from 'lodash-es';

import { lineMicrotask } from '@bp/shared/utils';

import { Destroyable } from '../destroyable';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class ControlComponent<T = any>
	extends Destroyable
	implements ControlValueAccessor, Validator, OnDestroy {

	@Input() value: T | null = null;

	@Output('valueChange') readonly valueChange$ = new Subject<T>();

	@HostBinding('class.control') isControl = true;

	@HostBinding('class.empty') get empty() { return isNil(this.value) || (<any> this.value) === ''; }

	protected _validator!: ValidatorFn | null;

	private _onChangeCallbacks: ((value: any) => void)[] = [];

	constructor(protected _cdr: ChangeDetectorRef) {
		super();
	}

	validatorOnChange = () => { };

	/** `View -> model callback called when value changes` */
	onChange: (value: any) => void = () => { };

	/** `View -> model callback called when input has been touched` */
	onTouched = () => { };

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: T): void {
		lineMicrotask(() => {
			this.value = value;
			this._cdr.markForCheck();
		});
	}

	registerOnChange(fn: (value: any) => void): void {
		this._onChangeCallbacks = uniq([ ...this._onChangeCallbacks, fn ]);
		this.onChange = v => this._onChangeCallbacks.forEach(cb => cb(v));
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
		return this._validator ? this._validator(c) : null;
	}
	// #endregion Implementation of the Validator interface

	setValue(value: T, { emitChange }: { emitChange: boolean; } = { emitChange: true }) {
		if (isEqual(value, this.value))
			// this.validatorOnChange();
			return;


		this.value = <T> value;
		console.warn(value, this.constructor.name);
		if (emitChange) {
			this.valueChange$.next(<T> value);
			this.onChange(value);
		}

		this.validatorOnChange();
		this._cdr.markForCheck();
	}

}
