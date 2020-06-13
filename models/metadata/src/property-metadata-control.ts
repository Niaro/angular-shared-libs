import { ValidatorFn, Validators } from '@angular/forms';
import { assign } from 'lodash-es';
import { FieldControlType } from './enums';

export class PropertyMetadataControl {

	readonly type = FieldControlType.input;

	readonly list: any[] = [];

	readonly required: boolean = false;

	readonly validator?: ValidatorFn;

	constructor(data?: Partial<PropertyMetadataControl>) {
		assign(this, data);

		if (this.type === FieldControlType.email)
			this.validator = Validators.email;
	}
}
