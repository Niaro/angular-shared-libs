import { Enumeration } from '@bp/shared/models/core/enum';
import { isBoolean } from 'lodash-es';

export class Ability extends Enumeration {

	static enabled = new Ability();

	static disabled = new Ability();

	static parseStrict(value: boolean | any): Ability {
		if (isBoolean(value))
			return value ? Ability.enabled : Ability.disabled;

		return Ability.parseStrict(value);
	}
}
