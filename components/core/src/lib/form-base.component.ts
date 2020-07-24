import { forOwn, get, isEmpty, partition } from 'lodash-es';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, EMPTY, of, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

import { ChangeDetectorRef, Directive, Input, isDevMode, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Destroyable, IApiErrorMessage, ResponseError } from '@bp/shared/models/common';
import { takeFirstTruthy } from '@bp/shared/rxjs';
import { FormGroupConfig } from '@bp/shared/typings';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class FormBaseComponent<T = any> extends Destroyable {

	@Input()
	get pending() { return this._pending; }
	set pending(value: boolean | null) {
		this._pending = !!value;
		if (this._pending)
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

		this._setGlobalAndControlErrors(value.messages);
	}
	private _error!: ResponseError | null;
	errors!: IApiErrorMessage[] | null;

	@Output('submitted')
	readonly submittedValidFormValue$ = new Subject<T>();

	private readonly _formEnabled$ = new BehaviorSubject(true);
	@Output('formEnabled')
	readonly formEnabled$ = this._formEnabled$.asObservable();

	private readonly _formDirtyAndValid$ = new BehaviorSubject(false);
	@Output('formDirtyAndValid')
	readonly formDirtyAndValid$ = this._formDirtyAndValid$.asObservable();

	// tslint:disable-next-line: no-output-native
	private readonly _formInvalid$ = new BehaviorSubject(false);
	@Output('formInvalid')
	readonly formInvalid$ = this._formInvalid$.asObservable();
	readonly formValid$ = this._formInvalid$.pipe(map(v => !v));

	private readonly _form$ = new BehaviorSubject<FormGroup | null>(null);
	readonly form$ = this._form$.asObservable();
	get form() { return this._form$.value; }
	set form(value: FormGroup | null) {
		this._form$.next(value);
		this._disableOnPending();
	}

	showInvalidInputsToast = true;

	constructor(
		protected _fb: FormBuilder,
		protected _cdr: ChangeDetectorRef,
		protected _toaster: ToastrService,
	) {
		super();
		this._observeFormEnabled();
		this._observeFormInvalid();
		this._observeFormDirtyAndValid();
	}

	submit() {
		isDevMode() && console.warn('submit');
		if (!this.form)
			return;

		this._revalidatedAndMarkInvalidAsDirtyAndTouchedRecursively(this._getRootForm(this.form));

		if (this.form.valid)
			this.submittedValidFormValue$.next(this.form.value);
		else if (this.showInvalidInputsToast)
			this._toaster.error('Some inputs are invalid!');

		this._cdr.detectChanges();
		this._cdr.markForCheck();
	}

	addChildForm(formName: string, form: FormGroup) {
		this.form?.setControl(formName, form);
	}

	resetFormState() {
		this.form?.markAsPristine();
		this.form?.markAsUntouched();
		this.form?.updateValueAndValidity(); // to invoke changes
	}

	protected _group<U = T>(config: FormGroupConfig<U>): FormGroup {
		return this._fb.group(config);
	}

	private _getRootForm(form: FormGroup | FormArray) {
		while (form.parent)
			form = form.parent;

		return form;
	}

	private _revalidatedAndMarkInvalidAsDirtyAndTouchedRecursively(control: AbstractControl) {
		control.updateValueAndValidity({ onlySelf: true });

		control.markAsTouched({ onlySelf: true });
		control.markAsDirty({ onlySelf: true });

		if (control instanceof FormGroup)
			forOwn(control.controls, c => this._revalidatedAndMarkInvalidAsDirtyAndTouchedRecursively(c));
		else if (control instanceof FormArray)
			control.controls.forEach(c => this._revalidatedAndMarkInvalidAsDirtyAndTouchedRecursively(c));
	}

	private _disableOnPending() {
		if (!this.form)
			return;

		if (this.pending)
			this.form.disable({ emitEvent: false });
		else
			this.form.enable({ emitEvent: false });
	}

	private _observeFormEnabled() {
		this.form$
			.pipe(
				switchMap(v => v
					? v.statusChanges.pipe(
						startWith(null),
						map(() => v.enabled)
					)
					: of(false)
				),
				distinctUntilChanged()
			)
			.subscribe(this._formEnabled$);
	}

	private _observeFormInvalid() {
		this.form$
			.pipe(
				switchMap(v => v
					? v.statusChanges.pipe(
						startWith(v.status),
						map(status => status === 'INVALID' || isEmpty(v.value))
					)
					: of(false)
				),
				distinctUntilChanged()
			)
			.subscribe(this._formInvalid$);
	}

	private _observeFormDirtyAndValid() {
		const formDirty$ = this.form$
			.pipe(
				switchMap(v => v
					? v.statusChanges.pipe(
						startWith(null),
						map(() => !!v.dirty),
					)
					: EMPTY
				),
				distinctUntilChanged()
			);

		combineLatest([
			this.formValid$,
			formDirty$
		])
			.pipe(map(([ valid, dirty ]) => valid && dirty))
			.subscribe(this._formDirtyAndValid$);
	}

	private async _setGlobalAndControlErrors(errors: IApiErrorMessage[]) {
		await this.formEnabled$
			.pipe(takeFirstTruthy)
			.toPromise();

		if (errors && this.form) {
			const [ errorsWithControls, errorsWithoutFoundControls ] = partition(
				errors
					.filter(v => !!v.field)
					.map(v => <const>[ v, get(this.form!.controls, v.field!.replace('.', '.controls.')) ]),
				v => !!v[ 1 ]
			);

			errorsWithControls
				.forEach(([ error, control ]) => control.setErrors({ server: error.message }));

			this.errors = [
				...errors.filter(it => !it.field),
				...errorsWithoutFoundControls.map(v => v[ 0 ])
			];
		}

		if (isEmpty(errors))
			this._error = this.errors = null;

		this._cdr.detectChanges();
	}

}
