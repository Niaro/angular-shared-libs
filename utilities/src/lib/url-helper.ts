import { Type } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, UrlSegmentGroup } from '@angular/router';
import { Dictionary } from '@bp/shared/typings';
import { isArray, isBoolean, isNil, isObject, last, mapValues, pickBy, toPairs } from 'lodash-es';

export class UrlHelper {
	static parse(value: string) {
		const values = UrlHelper.parseArray(value);

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
		return UrlHelper.parseArray(value)
			.map(id => +id)
			.filter(id => !isNaN(id));
	}

	static toRouteString(value: any) {
		if (isBoolean(value))
			return value ? 'true' : undefined;

		if (isArray(value) && value.length)
			return value
				.map(valueToString)
				.join(',');

		if (value === '')
			return;

		return valueToString(value);
	}

	static toRouteParams(value: {}) {
		return mapValues(value, v => UrlHelper.toRouteString(v));
	}

	static getRouteParams(route: ActivatedRoute): Params {
		const snapshot = UrlHelper.getMainBranchLastRoute(route.snapshot);
		const params = snapshot.url.length ? last(snapshot.url)!.parameters : snapshot.params;

		return pickBy(params, v => !isNil(v));
	}

	static mergeRouteParams(route: ActivatedRoute, params: Params) {
		const routeParams = UrlHelper.getRouteParams(route);

		toPairs(params)
			.map(([ k, v ]) => [ k, isNil(v) ? v : v.toString() ])
			.forEach(([ k, v ]) => isNil(v) || v === ''
				? delete routeParams[ k ]
				: routeParams[ k ] = v.toString()
			);

		return routeParams;
	}

	static getQueryParams(route: ActivatedRoute): Params {
		const snapshot = UrlHelper.getMainBranchLastRoute(route.snapshot);

		return pickBy(snapshot.queryParams, v => !isNil(v));
	}

	static getComponentRoute(route: ActivatedRouteSnapshot | ActivatedRoute, targetRouteCmpt: Type<any>)
		: ActivatedRouteSnapshot | ActivatedRoute | null {
		if (route.routeConfig?.component === targetRouteCmpt)
			return route;

		for (const childRoute of route.children) {
			const cmptRoute = UrlHelper.getComponentRoute(childRoute, targetRouteCmpt);
			if (cmptRoute)
				return cmptRoute;
		}

		return null;
	}

	static getMainBranchRoutes<T extends ActivatedRouteSnapshot | ActivatedRoute>(route: T): T[] {
		const results = [ route ];
		while (route.firstChild) {
			route = <T> route.firstChild;
			results.push(route);
		}

		return results;
	}

	static getMainBranchLastRoute<T extends ActivatedRouteSnapshot | ActivatedRoute>(route: T): T {
		while (route.firstChild)
			route = <T> route.firstChild;

		return route;
	}

	static buildUrlExcludingOutlet(outlet: string, router: Router) {
		const currentUrlTree = router.parseUrl(router.url);
		UrlHelper._deleteOutletRecursivelyFromSegments(outlet, currentUrlTree.root.children);

		return currentUrlTree.toString();
	}

	static appendQueryParams(url: string, params: Dictionary<string | number>) {
		if (isNil(url))
			return url;

		const queryParams = Object.keys(params)
			.filter(k => !isNil(params[ k ]) && !isNaN(<number> params[ k ]))
			.map(k => `${ encodeURIComponent(k) }=${ encodeURIComponent(params[ k ].toString()) }`)
			.join('&');

		return `${ url }${ url.includes('?') ? '&' : '?' }${ queryParams }`;
	}

	private static _deleteOutletRecursivelyFromSegments(outlet: string, dictionary: Dictionary<UrlSegmentGroup>) {
		for (const property of Object.keys(dictionary)) {
			if (property === outlet) {
				delete dictionary[ property ];

				return;
			}

			if (isObject(dictionary[ property ]))
				UrlHelper._deleteOutletRecursivelyFromSegments(outlet, dictionary[ property ].children);
		}
	}
}

function valueToString(value: any): string {
	return isNil(value)
		? undefined
		: value
			.valueOf()
			?.toString();
}
