import { assign } from 'lodash-es';
import { Omit } from '../typescript-types';

export class PropertyMetadata {
	label: string;

	/**
	 * the name of the property to which this metadata belongs
	 */
	readonly property: string;

	constructor(data: Partial<PropertyMetadata>) {
		assign(this, data);
	}
}
