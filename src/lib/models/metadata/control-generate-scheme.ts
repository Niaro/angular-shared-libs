import { isNumber, isBoolean, startCase } from 'lodash-es';

export class ControlGenerateScheme {
	type: 'input' | 'switch' | 'digits';

	property: string;

	label: string;

	constructor({ property, value }: { property: string, value: number | boolean | string }) {
		this.property = property;
		this.label = startCase(property);
		this.type = isNumber(value)
			? 'digits'
			: isBoolean(value) ? 'switch' : 'input';
	}
}
