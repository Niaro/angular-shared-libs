import { map, filter, flatMap, compact, mapValues, forOwn, mapKeys } from 'lodash-es';

// just add here the lodash functions you want to support
const chainableFunctions = {
	map,
	mapValues,
	mapKeys,
	filter,
	flatMap,
	compact,
	forOwn,
};

export const chain = <T>(input: T) => {
	let value: any = input;
	const wrapper = {
		...mapValues(chainableFunctions, (f: any) => (...args: any[]) => {
			// lodash always puts input as the first argument
			value = f(value, ...args);
			return wrapper;
		}),
		value: () => value,
	};
	return wrapper as _.LoDashExplicitWrapper<T>;
};
