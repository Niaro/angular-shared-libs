import { Directive, Input } from '@angular/core';

import { ClassMetadata, Entity } from '@bp/shared/models/metadata';
import { NonFunctionPropertyNames } from '@bp/shared/typings';

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
