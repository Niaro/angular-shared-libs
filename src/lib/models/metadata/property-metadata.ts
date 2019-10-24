import { assign, startCase } from 'lodash-es';

import { Enumeration } from '../misc';
import { FieldViewType } from './enums';
import { PropertyMetadataControl } from './property-metadata-control';

export class PropertyMetadata {
	label!: string;

	hint!: string | null;

	longHint!: string | null;

	placeholder!: string | null;

	mapper!: ((v: any, data: any) => any) | Enumeration | InstanceType<any>;

	default!: any | null;

	unserializable!: boolean | null;

	control = new PropertyMetadataControl();

	viewType = FieldViewType.text;

	viewFormatter!: (propValue: any) => any | null;

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
