import { isNumber, isBoolean, startCase } from 'lodash-es';

export class ControlGenerateScheme {
	type: 'input' | 'switch' | 'digits';

	key: string;

	label: string;

	constructor({ key, value }: { key: string, value: number | boolean | string }) {
		this.key = key;
		this.label = startCase(key);
		this.type = isNumber(value)
			? 'digits'
			: isBoolean(value) ? 'switch' : 'input';
	}
}
