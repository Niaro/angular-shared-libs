import { Input, Output, ChangeDetectorRef, Directive } from '@angular/core';
import { FormGroup, AbstractControl, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEmpty, forOwn } from 'lodash-es';
import { Subject, BehaviorSubject, of, combineLatest, EMPTY } from 'rxjs';
import { switchMap, map, distinctUntilChanged, startWith } from 'rxjs/operators';

import { ResponseError, IApiErrorMessage, FormGroupConfig, ClassMetadata } from '../models';

import { Destroyable } from './destroyable';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class FormBaseComponent<T = any> extends Destroyable {

	@Input() metadata!: ClassMetadata;

	@Input()
	get pending() { return this._pending; }
	set pending(value: boolean) {
		this._pending = value;
		this.errors = null;
		this._disableOnPending();
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
		this._cdr.detectChanges();
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
		this._disableOnPending();
	}

	showInvalidInputsSnack = true;

	constructor(
		protected _fb: FormBuilder,
		protected _cdr: ChangeDetectorRef,
		protected _snackBar: MatSnackBar
	) {
		super();
		this._setupInvalidObservable();
		this._setupCanSaveObservable();
	}

	label(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(prop)!.label;
	}

	meta(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(prop);
	}

	submit() {
		if (!this.form)
			return;

		this._revalidatedAndMarkInvalidAsDirtyAndTouchedRecursively(this.form);

		if (this.form.valid)
			this.submitted$.next(this.form.value);
		else if (this.showInvalidInputsSnack)
			this._snackBar.open(
				'Some inputs are invalid!',
				undefined,
				{
					panelClass: 'error'
				});

		this._cdr.detectChanges();
	}

	protected _group<U = T>(config: FormGroupConfig<U>): FormGroup {
		return this._fb.group(config);
	}

	private _revalidatedAndMarkInvalidAsDirtyAndTouchedRecursively(control: AbstractControl) {
		if (control instanceof FormGroup)
			forOwn(control.controls, c => this._revalidatedAndMarkInvalidAsDirtyAndTouchedRecursively(c));
		else if (control instanceof FormArray)
			control.controls.forEach(c => this._revalidatedAndMarkInvalidAsDirtyAndTouchedRecursively(c));
		else if (control instanceof FormControl) {
			control.updateValueAndValidity();

			if (control.invalid) {
				control.markAsTouched();
				control.markAsDirty();
			}
		}
	}

	private _disableOnPending() {
		if (!this.form)
			return;

		if (this.pending)
			this.form.disable({ emitEvent: false });
		else
			this.form.enable({ emitEvent: false });
	}

	private _setupInvalidObservable() {
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

	private _setupCanSaveObservable() {
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
						map(() => !!v.dirty && !!v.touched)
					)
					: EMPTY
				),
				distinctUntilChanged()
			);

		combineLatest(validForm$, dirtyForm$)
			.pipe(map(([valid, dirty]) => valid && dirty))
			.subscribe(this.canSave$);
	}
}
