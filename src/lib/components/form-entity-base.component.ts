import { Input, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isNil, isEqual } from 'lodash-es';
import { Subject, of } from 'rxjs';
import { switchMap, auditTime, map, filter, startWith } from 'rxjs/operators';

import { MetadataEntity, Entity } from '../models';

import { FormBaseComponent } from './form-base.component';

export abstract class FormEntityBaseComponent<T extends Entity> extends FormBaseComponent<T> {

	@Input() model!: T;

	@Output() readonly modelChange = new Subject();

	abstract type: typeof MetadataEntity;

	get isAdding() { return isNil(this.model.id); }

	constructor(
		protected fb: FormBuilder,
		protected cdr: ChangeDetectorRef,
		protected snackBar: MatSnackBar
	) {
		super(fb, cdr, snackBar);
		this.onFormGroupChangeEmitModelChange();
	}

	label(prop: NonFunctionPropertyNames<T>) {
		return this.type.getLabel(prop);
	}

	meta(prop: NonFunctionPropertyNames<T>) {
		return this.type.metadata.get(<string>prop);
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
				auditTime(500),
				map(v => v && new (<any>this.type)(v)),
				filter(v => !isEqual(v, this.model))
			)
			.subscribe(this.modelChange);
	}
}
