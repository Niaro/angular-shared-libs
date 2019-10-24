import { Input, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEmpty, forOwn } from 'lodash-es';
import { Subject, BehaviorSubject, of, combineLatest, empty } from 'rxjs';
import { switchMap, map, distinctUntilChanged, startWith } from 'rxjs/operators';

import { ResponseError, IApiErrorMessage } from '../models';
import { AsyncVoidSubject } from '../rxjs';

export abstract class FormBaseComponent<T = any> implements OnDestroy {

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

		if (value.messages && this.form) {
			value.messages
				.filter(it => !!it.field)
				.forEach(it => this.form!.controls[it.field!].setErrors({ server: it.message }));

			this.errors = value.messages.filter(it => !it.field);
		}

		if (isEmpty(value.messages))
			this._error = this.errors = null;
		this.cdr.detectChanges();
	}
	private _error!: ResponseError | null;
	errors!: IApiErrorMessage[] | null;

	@Output('submitted')
	readonly submitted$ = new Subject<T>();

	@Output('canSave')
	readonly canSave$ = new BehaviorSubject(false);

	// tslint:disable-next-line: no-output-native
	@Output('invalid')
	readonly invalid$ = new BehaviorSubject(false);

	readonly valid$ = this.invalid$.pipe(map(v => !v));

	readonly form$ = new BehaviorSubject<FormGroup | null>(null);
	get form() { return this.form$.value; }
	set form(value: FormGroup | null) {
		this.form$.next(value);
		this.disableOnPending();
	}

	showInvalidInputsSnack = true;

	protected readonly destroyed$ = new AsyncVoidSubject();

	constructor(
		protected fb: FormBuilder,
		protected cdr: ChangeDetectorRef,
		protected snackBar: MatSnackBar
	) {
		this.setupInvalidObservable();
		this.setupCanSaveObservable();
	}

	ngOnDestroy() {
		this.destroyed$.complete();
	}

	submit() {
		if (!this.form)
			return;

		this.revalidatedAndMarkInvalidAsDirtyAndTouchedRecursively(this.form);

		if (this.form.valid)
			this.submitted$.next(this.form.value);
		else if (this.showInvalidInputsSnack)
			this.snackBar.open(
				'Some inputs are invalid!',
				undefined,
				{
					panelClass: 'error'
				});

		this.cdr.detectChanges();
	}

	private revalidatedAndMarkInvalidAsDirtyAndTouchedRecursively(control: AbstractControl) {
		if (control instanceof FormGroup)
			forOwn(control.controls, c => this.revalidatedAndMarkInvalidAsDirtyAndTouchedRecursively(c));
		else if (control instanceof FormArray)
			control.controls.forEach(c => this.revalidatedAndMarkInvalidAsDirtyAndTouchedRecursively(c));
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
				this.form.disable({ emitEvent: false });
			else
				this.form.enable({ emitEvent: false });
		}
	}

	private setupInvalidObservable() {
		this.form$
			.pipe(
				switchMap(v => v
					? v.statusChanges.pipe(
						startWith(v.status),
						map(status => status === 'INVALID')
					)
					: of(false)
				),
				distinctUntilChanged()
			)
			.subscribe(this.invalid$);
	}

	private setupCanSaveObservable() {
		const validForm$ = this.form$.pipe(
			switchMap(v => v
				? v.statusChanges.pipe(
					startWith(v.status),
					map(status => status === 'VALID')
				)
				: of(false)
			),
			distinctUntilChanged()
		);

		const dirtyForm$ = this.form$
			.pipe(
				switchMap(v => v
					? v.statusChanges.pipe(
						startWith(null),
						map(() => !!v.dirty)
					)
					: empty()
				),
				distinctUntilChanged()
			);

		combineLatest(validForm$, dirtyForm$)
			.pipe(map(([valid, dirty]) => valid && dirty))
			.subscribe(this.canSave$);
	}
}
