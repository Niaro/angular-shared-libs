import { Input, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEmpty, forOwn } from 'lodash-es';
import { Subject } from 'rxjs';

import { ResponseError, IApiErrorMessage } from '../models';
import { AsyncVoidSubject } from '../rxjs';

export abstract class FormBaseComponent<T> implements OnDestroy {

	@Input()
	get pending() { return this._pending; }
	set pending(value: boolean) {
		this._pending = value;
		this.errors = null;
		this.disableOnPending();
	}
	private _pending = false;

	@Input()
	get apiError(): ResponseError | null { return this._error; }
	set apiError(value: ResponseError | null) {
		this._error = value;

		if (!value) {
			this.errors = null;
			return;
		}

		if (value.messages) {
			value.messages
				.filter(it => !!it.field)
				.forEach(it => this.form.controls[it.field!].setErrors({ server: it.message }));

			this.errors = value.messages.filter(it => !it.field);
		}

		if (isEmpty(value.messages))
			this._error = this.errors = null;
		this.cdr.detectChanges();
	}
	private _error!: ResponseError | null;
	errors!: IApiErrorMessage[] | null;

	@Output()
	readonly submitted = new Subject<T>();

	get form() { return this._form; }
	set form(value: FormGroup) {
		this._form = value;
		this.disableOnPending();
	}
	private _form!: FormGroup;

	showInvalidInputsSnack = true;

	protected destroyed$ = new AsyncVoidSubject();

	constructor(
		protected fb: FormBuilder,
		protected cdr: ChangeDetectorRef,
		protected snackBar: MatSnackBar
	) { }

	ngOnDestroy() {
		this.destroyed$.complete();
	}

	submit() {
		this.revalidatedAndMarkAsDirtyAndTouchedRecursively(this.form);

		if (this.form.valid)
			this.submitted.next(this.form.value);
		else if (this.showInvalidInputsSnack)
			this.snackBar.open(
				'Some inputs are invalid!',
				undefined,
				{
					panelClass: 'error'
				});

		this.cdr.detectChanges();
	}

	private revalidatedAndMarkAsDirtyAndTouchedRecursively(control: AbstractControl) {
		if (control instanceof FormGroup)
			forOwn(control.controls, c => this.revalidatedAndMarkAsDirtyAndTouchedRecursively(c));
		else if (control instanceof FormArray)
			control.controls.forEach(c => this.revalidatedAndMarkAsDirtyAndTouchedRecursively(c));
		else if (control instanceof FormControl) {
			control.updateValueAndValidity();

			if (control.invalid) {
				control.markAsTouched();
				control.markAsDirty();
			}
		}
	}

	private disableOnPending() {
		if (this.form) {
			if (this.pending)
				this.form.disable();
			else
				this.form.enable();
		}
	}
}
