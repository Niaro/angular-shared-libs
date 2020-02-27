import { isFunction } from 'lodash-es';

export function isExtensionOf<T extends Function>(targetType: T, ancestorType: T): boolean {
	if (!isFunction(targetType) || !isFunction(targetType))
		throw new Error('isExtensionOf accepts only functions');

	do {
		targetType = Object.getPrototypeOf(targetType);
		if (targetType === ancestorType)
			return true;
	}
	while (targetType);

	return false;
}
