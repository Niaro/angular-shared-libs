import { Input } from '@angular/core';

import { MetadataEntity, Entity } from '../models';

export abstract class ViewEntityBaseComponent<T extends Entity> {

	@Input() model!: T;

	abstract type: typeof MetadataEntity;

	label(prop: NonFunctionPropertyNames<T>) {
		return this.type.getLabel(prop);
	}

	meta(prop: NonFunctionPropertyNames<T>) {
		return this.type.metadata.get(<string>prop);
	}
}
