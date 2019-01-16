import { Type } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Params } from '@angular/router';
import { isBoolean, isArray, mapValues, pickBy, isNil, reduce, last, toPairs } from 'lodash-es';

export class UrlHelper {
	static parse(value: string) {
		const values = this.parseArray(value);
		return values.length === 0
			? null
			: values.length > 1 ? values : value.toString();
	}

	static parseArray(value: string) {
		return value
			? value
				.toString()
				.split(',')
				.filter(v => v !== '')
			: [];
	}

	static parseNumberArray(value: string): number[] {
		return this.parseArray(value)
			.map(id => +id)
			.filter(id => !isNaN(id));
	}

	static toRouteString(value: any) {
		if (isBoolean(value))
			return value ? 'true' : null;
		if (isArray(value) && value.length)
			return value.map(v => valueToString(v)).join(',');
		if (value === '')
			return null;
		return valueToString(value);
	}

	static toRouteParams(value: {}) {
		return mapValues(value, v => this.toRouteString(v));
	}

	static getRouteParams(route: ActivatedRoute): Params {
		const snapshot = UrlHelper.getMainBranchLastRoute(route.snapshot);
		const params = snapshot.url.length ? last(snapshot.url).parameters : snapshot.params;
		return pickBy(params, v => !isNil(v));
	}

	static mergeRouteParams(route: ActivatedRoute, params: Params) {
		const routeParams = this.getRouteParams(route);

		toPairs(params)
			.map(([k, v]) => [k, isNil(v) ? v : v.toString()])
			.forEach(([k, v]) => isNil(v) || v === ''
				? delete routeParams[k]
				: routeParams[k] = v.toString()
			);

		return routeParams;
	}

	static getQueryParams(route: ActivatedRoute): Params {
		const snapshot = UrlHelper.getMainBranchLastRoute(route.snapshot);
		return pickBy(snapshot.queryParams, v => !isNil(v));
	}

	static getComponentRoute(route: ActivatedRouteSnapshot | ActivatedRoute, component: Type<any>): ActivatedRouteSnapshot | ActivatedRoute {
		if (route.routeConfig && route.routeConfig.component === component)
			return route;

		for (const childRoute of route.children) {
			const cmptRoute = this.getComponentRoute(childRoute, component);
			if (cmptRoute)
				return cmptRoute;
		}
	}

	static getMainBranchRoutes<T extends ActivatedRouteSnapshot | ActivatedRoute>(route: T): T[] {
		const results: T[] = [route];
		while (route.firstChild) {
			route = route.firstChild as T;
			results.push(route);
		}
		return results;
	}

	static getMainBranchLastRoute<T extends ActivatedRouteSnapshot | ActivatedRoute>(route: T): T {
		while (route.firstChild)
			route = route.firstChild as T;
		return route;
	}

	static appendQueryParams(url: string, params: {}) {
		if (isNil(url))
			return url;

		let has = url.includes('?');
		return reduce(params, (_url, value, key) => {
			if (isNil(value) || isNaN(value))
				return _url;

			let separator = '&';
			if (!has) {
				separator = '?';
				has = true;
			}
			return _url + separator + key + '=' + value;
		}, url);
	}
}

function valueToString(value: any): string {
	return isNil(value) ? null : value.valueOf() && value.valueOf().toString();
}
