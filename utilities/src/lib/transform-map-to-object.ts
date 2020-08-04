import { isArray, isNumber, isObjectLike, isString } from 'lodash-es';

export function transformMapToObject(map: Map<any, any>) {
	const entries = Array.from(map.entries());

	assertMapKeysSerializable(entries);

	const mapAsPlainObject = Object.fromEntries(
		entries.map(([ key, value ]) => <const>[ JSON.stringify(key), value ])
	);

	assertMapKeysImplementedSerializationProtocol(mapAsPlainObject);

	return mapAsPlainObject;
}

function assertMapKeysSerializable(entries: [ any, any ][]) {
	if (entries.some(([ key ]) => isArray(key)
		|| !isNumber(key)
		&& !isString(key)
		&& !isObjectLike(key)
	))
		throw new Error('To transform map to object, the map\'s keys must be Number or String or Object type');
}

function assertMapKeysImplementedSerializationProtocol(obj: Object) {
	if (obj.hasOwnProperty('{}'))
		throw new Error('Map object keys must implement toJSON protocol to be properly serialized');
}
