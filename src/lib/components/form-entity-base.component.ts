import { Input, Output, ChangeDetectorRef, OnChanges, SimpleChanges, Directive } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { isNil, isEqual, mapValues, forEach, get, isPlainObject, isEmpty } from 'lodash-es';
import { of, BehaviorSubject } from 'rxjs';
import { switchMap, auditTime, map, filter, startWith } from 'rxjs/operators';

import { Entity, FormScheme, MetadataEntity } from '../models';

import { FormBaseComponent } from './form-base.component';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class FormEntityBaseComponent<T extends Entity = Entity>
	extends FormBaseComponent<T>
	implements OnChanges {

	private readonly _entity$ = new BehaviorSubject<T | null>(null);

	@Output('entityChange') readonly entity$ = this._entity$.asObservable();

	@Input()
	get entity() { return this._entity$.value!; }
	set entity(value: T | null) { this._entity$.next(value); }

	@Input() factory!: (v?: Partial<T>) => T;

	get isAdding() { return this.entity && isNil(this.entity.id); }

	get controls(): { [ K in NonFunctionPropertyNames<T> ]: FormControl } | null {
		return <any> this.form?.controls ?? null;
	}

	private _formScheme?: FormScheme<T>;

	constructor(
		fb: FormBuilder,
		cdr: ChangeDetectorRef,
		toaster: ToastrService,
	) {
		super(fb, cdr, toaster);
		this._onFormGroupChangeEmitEntityChange();
	}

	ngOnChanges({ entity }: SimpleChanges) {
		if (entity)
			this._updateFormScheme();
	}

	private _updateFormScheme() {
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
			? this._generateFormByScheme(<FormScheme<any>> v, get(entity, k))
			: [ get(entity, k), v ]
		));
	}

	protected _repopulateFormByScheme(
		form = this.form,
		formScheme = this._formScheme,
		entity = this.entity
	) {
		form && forEach(formScheme, (v, k) => isPlainObject(v)
			? this._repopulateFormByScheme(<FormGroup> form.controls[ k ], <FormScheme<any>> v, get(entity, k))
			: (<FormControl> form.controls[ k ])
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
					: of()
				),
				auditTime(50),
				filter(v => !isEmpty(v)),
				map(v => this.factory({ ...this.entity, ...v })),
				filter(v => !isEqual(v, this.entity))
			)
			.subscribe(v => this.entity = v);
	}
}
