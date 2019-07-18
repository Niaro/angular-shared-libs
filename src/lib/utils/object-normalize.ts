import { mapValues, isString, isObject } from 'lodash-es';
import { isArray } from 'util';

/**
 * Turn all parseable string values into objects recursively;
 */
export function normalize(value: any) {
	value = parse(value);
	return isArray(value)
		? value.map(v => normalize(v))
		: isObject(value)
			? mapValues(value, v => normalize(v))
			: value;
}

function parse(value: any) {
	try {
		if (isString(value)) {
			value = JSON.parse(value);
			return value;
		}
	} catch (error) { }
	return value;
}
