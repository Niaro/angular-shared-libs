import { Input } from '@angular/core';

import { Entity, PropertiesMetadata } from '../models';

export abstract class ViewEntityBaseComponent<T extends Entity> {

	@Input() entity!: T;

	@Input() metadata!: PropertiesMetadata;

	label(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(<string>prop)!.label;
	}

	meta(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(<string>prop);
	}

}
