import { mapValues, isString } from 'lodash-es';

/**
 * Turn all parseable string values into objects recursively;
 */
export function normalize(object: any) {
	return mapValues(object, (v) => {
		try {
			if (isString(v)) {
				v = JSON.parse(v);
				return normalize(v);
			}
		} catch (error) { }
		return v;
	});
}
