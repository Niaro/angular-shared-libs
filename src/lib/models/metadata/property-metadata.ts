import { assign } from 'lodash-es';
import { Enumeration } from '../misc';

export class PropertyMetadata {
	label!: string;

	mapper!: ((v: any, data: any) => any) | Enumeration | InstanceType<any>;

	default!: any;

	unserializable!: boolean;

	/**
	 * the name of the property to which this metadata belongs
	 */
	readonly property!: string;

	constructor(data: Partial<PropertyMetadata>) {
		assign(this, data);
	}
}
