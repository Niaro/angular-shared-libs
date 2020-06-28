import { Directive, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormBaseComponent } from '@bp/shared/components/core';
import { ClassMetadata, MetadataEntity, PropertyMetadata } from '@bp/shared/models/metadata';
import { NonFunctionPropertyNames } from '@bp/shared/typings';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class FormMetadataBaseComponent<T = MetadataEntity> extends FormBaseComponent<T> {

	@Input() metadata!: ClassMetadata;

	label(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(prop)!.label;
	}

	meta(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(prop);
	}

	getMetaControl(md: PropertyMetadata): FormControl | null {
		return <FormControl> this.form?.controls[ md.property ] ?? null;
	}

}
