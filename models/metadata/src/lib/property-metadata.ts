import { Type } from '@angular/core';
import { assign, startCase, isNil } from 'lodash-es';

import { Enumeration } from '@bp/shared/models/core';

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

	readonly label!: string;

	readonly hint: string = '';

	readonly longHint: string = '';

	readonly placeholder: string = '';

	readonly mapper: PropertyMapper | null = null;

	readonly defaultPropertyValue?: any;

	readonly control = new PropertyMetadataControl();

	readonly viewType = FieldViewType.text;

	readonly viewFormatter: ((propValue: any) => any) | null = null;

	readonly table: PropertyMetadataTable | null = null;

	readonly unserializable: boolean = false;

	readonly copyable: boolean = false;

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
