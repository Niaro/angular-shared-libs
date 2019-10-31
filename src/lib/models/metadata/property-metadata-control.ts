import { assign } from 'lodash-es';
import { FieldControlType } from './enums';

export class PropertyMetadataControl {

	type!: FieldControlType;

	list?: any[];

	constructor(data: Partial<PropertyMetadataControl>) {
		assign(this, data);
	}
}
