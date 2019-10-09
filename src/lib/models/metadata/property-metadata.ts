import { assign, startCase } from 'lodash-es';

import { Enumeration } from '../misc';
import { FieldControlType, FieldViewType } from './enums';
import { PropertyMetadataControl } from './property-metadata-control';

export class PropertyMetadata {
	label!: string;

	hint!: string;

	placeholder!: string;

	required!: boolean;

	mapper!: ((v: any, data: any) => any) | Enumeration | InstanceType<any>;

	default!: any;

	unserializable!: boolean;

	control = new PropertyMetadataControl({ type: FieldControlType.input });

	viewType = FieldViewType.text;

	/**
	 * the name of the property to which this metadata belongs
	 */
	readonly property!: string;

	readonly displayPropertyName: string;

	constructor(data: Partial<PropertyMetadata>) {
		assign(this, data);

		this.displayPropertyName = startCase(this.property);
		this.label = this.label && this.label !== this.displayPropertyName
			? this.label
			: this.displayPropertyName;
	}
}
