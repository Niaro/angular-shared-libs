import { Input } from '@angular/core';
import { isNil } from 'lodash-es';

import { MetadataEntity, Entity } from '../models';

import { FormBaseComponent } from './form-base.component';

export abstract class FormEntityBaseComponent<T extends Entity> extends FormBaseComponent<T> {

	@Input() model!: T;

	abstract type: typeof MetadataEntity;

	get isAdding() { return isNil(this.model.id); }

	label(prop: string) {
		return this.type.getLabel(prop);
	}
}
