import { Input, Output, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isNil, isEqual, mapValues, forEach, get, isPlainObject } from 'lodash-es';
import { Subject, of } from 'rxjs';
import { switchMap, auditTime, map, filter, startWith } from 'rxjs/operators';

import { Entity, FormScheme, MetadataEntity } from '../models';

import { FormBaseComponent } from './form-base.component';
import { OptionalBehaviorSubject } from '../rxjs';


export abstract class FormEntityBaseComponent<T extends Entity = Entity>
	extends FormBaseComponent<T>
	implements OnChanges {

	@Input() entity!: T | null;

	@Output('entityChange') readonly entityChange$ = new Subject<T>();

	@Input() factory!: (v?: Partial<T>) => T;

	entity$ = new OptionalBehaviorSubject<T | null>();

	get isAdding() { return this.entity && isNil(this.entity.id); }

	get controls(): { [K in NonFunctionPropertyNames<T>]: AbstractControl } | null {
		return this.form && <any>this.form.controls;
	}

	private _formScheme?: FormScheme<T>;

	constructor(
		protected _fb: FormBuilder,
		protected _cdr: ChangeDetectorRef,
		protected _snackBar: MatSnackBar
	) {
		super(_fb, _cdr, _snackBar);
		this._onFormGroupChangeEmitEntityChange();
	}

	ngOnChanges({ entity }: SimpleChanges) {
		if (entity)
			this._updateFormScheme();
	}

	private _updateFormScheme() {
		this.entity$.next(this.entity);
		this.entity && this.form && this._formScheme
			? this._repopulateFormByScheme()
			: this._setForm();
	}

	setFormScheme(scheme: FormScheme<T>) {
		this._formScheme = scheme;
	}

	protected _setForm() {
		this.form = this._generateFormByScheme();
	}

	protected _generateFormByScheme(
		formScheme = this._formScheme,
		entity: MetadataEntity = this.entity || this.factory()
	): FormGroup {
		if (!formScheme)
			throw new Error('The default behavior of the form entity base class requires the form scheme to be set on the constructor');

		return this._fb.group(mapValues(formScheme, (v, k) => isPlainObject(v)
			? this._generateFormByScheme(<FormScheme<any>>v, get(entity, k))
			: [get(entity, k), v]
		));
	}

	protected _repopulateFormByScheme(
		form = this.form,
		formScheme = this._formScheme,
		entity = this.entity
	) {
		form && forEach(formScheme, (v, k) => isPlainObject(v)
			? this._repopulateFormByScheme(<FormGroup>form.controls[k], <FormScheme<any>>v, get(entity, k))
			: (<FormControl>form.controls[k])
				.setValue(get(entity, k), { emitEvent: false, emitModelToViewChange: true })
		);
	}

	private _onFormGroupChangeEmitEntityChange() {
		this.form$
			.pipe(
				switchMap(v => v
					? v.valueChanges
						.pipe(
							startWith(v.value),
							filter(() => v.enabled)
						)
					: of(null)
				),
				filter(() => !!this.entityChange$.observers.length),
				auditTime(250),
				map(v => v && this.factory({ ...this.entity, ...v })),
				filter(v => !isEqual(v, this.entity))
			)
			.subscribe(this.entityChange$);
	}
}
