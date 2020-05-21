import { isNumber, camelCase, upperFirst, startCase } from 'lodash-es';
import m from 'moment';

export function booleanMapper(v: any) {
	return v === 'true' || v === true;
}

export function pascalCase(v: any) {
	return upperFirst(camelCase(v));
}

export function titleCase(v: any) {
	return startCase(v);
}

export function numberMapper(v: any) {
	return isNumber(v) && !isNaN(v) ? v : 0;
}

export function unixMomentMapper(v: any) {
	return m.isMoment(v) ? v : m.unix(v);
}

export function momentMapper(v: any) {
	return m.isMoment(v) ? v : m(v);
}
