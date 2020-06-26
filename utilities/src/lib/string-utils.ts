import { isNil } from 'lodash-es';

/**
 * Case insensitive search for the substring
 */
export function includes(target: string, search: string) {
	if (!target)
		return false;
	search = isNil(search) ? '' : search;

	return target.search(new RegExp(regexpEscape(search), 'i')) !== -1;
}

export function match(target: string, search: string) {
	if (!target)
		return false;
	search = isNil(search) ? '' : search;

	return target.search(new RegExp(`^${ regexpEscape(search) }$`, 'i')) !== -1;
}

function regexpEscape(str: string) {
	return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
