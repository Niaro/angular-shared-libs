import { mapValues, isString, isObject } from 'lodash-es';

/**
 * Parses values of the objects;
 */
export function normalize(value: Object | Object[]): Object | any {
	return Array.isArray(value)
		? value.map(v => normalize(v))
		: isObject(value)
			? mapValues(value, v => parse(v))
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
