import { Type } from '@angular/core';
import { assign, startCase, isNil } from 'lodash-es';

import { Enumeration } from '../misc';
import { FieldViewType } from './enums';
import { PropertyMetadataControl } from './property-metadata-control';
import { PropertyMetadataTable } from './property-metadata-table';
import { MetadataEntity } from './metadata-entity';

export type PropertyMapperFunction = (value: any, constructorData: any, self: any) => any;

export type PropertyMapper = PropertyMapperFunction
	| typeof Enumeration
	| typeof MetadataEntity
	| Type<Enumeration>
	| Type<MetadataEntity>;

export class PropertyMetadata {

	label!: string;

	hint = '';

	longHint = '';

	placeholder = '';

	mapper: PropertyMapper | null = null;

	default?: any;

	control = new PropertyMetadataControl();

	viewType = FieldViewType.text;

	viewFormatter: ((propValue: any) => any) | null = null;

	table: PropertyMetadataTable | null = null;

	unserializable = false;

	copyable = false;

	/**
	 * the name of the property to which this metadata belongs
	 */
	readonly property!: string;

	readonly displayPropertyName: string;

	constructor(data: Partial<PropertyMetadata>) {
		assign(this, data);

		this.displayPropertyName = startCase(this.property);
		this.label = !isNil(this.label) && this.label !== this.displayPropertyName
			? this.label
			: this.displayPropertyName;
	}

}
