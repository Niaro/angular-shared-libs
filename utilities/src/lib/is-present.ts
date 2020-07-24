import { isNil } from 'lodash-es';

export function isPresent<T>(value: T): boolean {
	return !isNil(value);
}
