import { Input } from '@angular/core';

import { Entity, ClassMetadata } from '../models';

export abstract class ViewEntityBaseComponent<T extends Entity> {

	@Input() entity!: T;

	@Input() metadata!: ClassMetadata;

	label(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(<string>prop)!.label;
	}

	meta(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(<string>prop);
	}

}
