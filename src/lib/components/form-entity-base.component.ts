import { Input, Output, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isNil, isEqual, mapValues, forEach, get, isPlainObject } from 'lodash-es';
import { Subject, of } from 'rxjs';
import { switchMap, auditTime, map, filter, startWith } from 'rxjs/operators';

import { Entity, ClassMetadata, FormScheme, MetadataEntity } from '../models';

import { FormBaseComponent } from './form-base.component';


export abstract class FormEntityBaseComponent<T extends Entity = Entity>
	extends FormBaseComponent<T>
	implements OnChanges {

	@Input() entity!: T | null;

	@Output() readonly entityChange = new Subject<T>();

	@Input() metadata!: ClassMetadata;

	@Input() factory!: (v?: Partial<T>) => T;

	get isAdding() { return this.entity && isNil(this.entity.id); }

	get controls(): { [K in NonFunctionPropertyNames<T>]: AbstractControl } | null {
		return this.form && this.form.controls as any;
	}

	private formScheme!: FormScheme<T>;

	constructor(
		protected fb: FormBuilder,
		protected cdr: ChangeDetectorRef,
		protected snackBar: MatSnackBar
	) {
		super(fb, cdr, snackBar);
		this.onFormGroupChangeEmitModelChange();
	}

	ngOnChanges({ entity }: SimpleChanges) {
		if (entity && this.formScheme)
			this.entity && this.form ? this.repopulateFormByScheme() : this.setForm();
	}

	setFormScheme(scheme: FormScheme<T>) {
		this.formScheme = scheme;
	}

	label(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(<string>prop)!.label;
	}

	meta(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(<string>prop);
	}

	protected setForm() {
		this.form = this.generateFormByScheme();
	}

	protected generateFormByScheme(
		formScheme = this.formScheme,
		entity: MetadataEntity = this.entity || this.factory()
	): FormGroup {
		if (!formScheme)
			throw new Error('The default behavior of the form entity base class requires the form scheme to be set on the constructor');

		return this.fb.group(mapValues(formScheme, (v, k) => isPlainObject(v)
			? this.generateFormByScheme(v as FormScheme<any>, get(entity, k))
			: [get(entity, k), v]
		));
	}

	protected repopulateFormByScheme(
		form = this.form,
		formScheme = this.formScheme,
		entity = this.entity
	) {
		form && forEach(formScheme, (v, k) => isPlainObject(v)
			? this.repopulateFormByScheme(form.controls[k] as FormGroup, v as FormScheme<any>, get(entity, k))
			: (<FormControl>form.controls[k])
				.setValue(get(entity, k), { emitEvent: false, emitModelToViewChange: true })
		);
	}

	private onFormGroupChangeEmitModelChange() {
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
				filter(() => !!this.entityChange.observers.length),
				auditTime(250),
				map(v => v && this.factory({ ...this.entity, ...v })),
				filter(v => !isEqual(v, this.entity))
			)
			.subscribe(this.entityChange);
	}
}
