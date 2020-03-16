import { Input, Directive } from '@angular/core';

import { Entity, ClassMetadata } from '../models';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class ViewEntityBaseComponent<T extends Entity> {

	@Input() entity!: T | null;

	@Input() metadata!: ClassMetadata;

	label(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(prop)!.label;
	}

	meta(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(prop);
	}

}
