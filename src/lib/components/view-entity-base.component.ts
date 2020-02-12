import { Input, Directive } from '@angular/core';

import { Entity, ClassMetadata } from '../models';

@Directive()
export abstract class ViewEntityBaseComponent<T extends Entity> {

	@Input() entity!: T;

	@Input() metadata!: ClassMetadata;

	label(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(prop)!.label;
	}

	meta(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(prop);
	}

}
