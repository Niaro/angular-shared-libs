import { assign } from 'lodash-es';
import { ValidatorFn } from '@angular/forms';

import { FieldControlType } from './enums';

export class PropertyMetadataControl {

	type = FieldControlType.input;

	list?: any[];

	validator?: ValidatorFn;

	required = false;

	constructor(data?: Partial<PropertyMetadataControl>) {
		assign(this, data);
	}
}
