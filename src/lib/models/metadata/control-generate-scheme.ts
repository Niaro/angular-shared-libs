import { Omit } from '../misc/typescript-types';
import { assign, isNumber, isBoolean } from 'lodash-es';

export class ControlGenerateScheme {
	type: 'input' | 'switch' | 'digits';
	value: number | boolean | string;
	property: string;

	constructor(data: Omit<Partial<ControlGenerateScheme>, 'type'>) {
		assign(this, data);

		this.type = isNumber(this.value)
			? 'digits'
			: isBoolean(this.value) ? 'switch' : 'input';
	}
}
