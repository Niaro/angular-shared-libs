import { isFunction } from 'lodash-es';

export function isExtensionOf<T>(targetType: any, ancestorType: T): boolean {
	if (!isFunction(targetType))
		return false;

	do {
		targetType = Object.getPrototypeOf(targetType);
		if (targetType === ancestorType)
			return true;
	}
	while (targetType);

	return false;
}
