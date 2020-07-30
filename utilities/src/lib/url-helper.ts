import { isArray, isBoolean, isNil, isObject, last, mapValues, pickBy } from 'lodash-es';

import { Type } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, UrlSegmentGroup } from '@angular/router';

import { Dictionary } from '@bp/shared/typings';

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
			.filter(id => !Number.isNaN(id));
	}

	static toRouteString(value: any) {
		if (isBoolean(value))
			return value ? 'true' : undefined;

		if (isArray(value))
			return value.length
				? value
					.map(valueToString)
					.join(',')
				: undefined;

		if (value === '')
			return;

		return valueToString(value);
	}

	static toRouteParams(value: {}) {
		return mapValues(value, v => UrlHelper.toRouteString(v));
	}

	static getLastPrimaryRouteNonNilParams(route: ActivatedRoute): Params {
		return UrlHelper.getRouteSnapshotNonNilParams(UrlHelper.getLastPrimaryRoute(route));
	}

	static mergeLastPrimaryRouteSnapshotParamsWithSourceParams(route: ActivatedRoute, sourceParams: Params) {
		return UrlHelper._mergeRouteParamsAndDeleteNilAndEmptyValues(
			UrlHelper.getLastPrimaryRouteNonNilParams(route),
			sourceParams
		);
	}

	static mergeRouteSnapshotParamsWithSourceParams(
		routeOrRouteSnapshot: ActivatedRoute | ActivatedRouteSnapshot,
		sourceParams: Params
	) {
		return UrlHelper._mergeRouteParamsAndDeleteNilAndEmptyValues(
			UrlHelper.getRouteSnapshotNonNilParams(routeOrRouteSnapshot),
			sourceParams
		);
	}

	static getRouteSnapshotNonNilParams(routeOrRouteSnapshot: ActivatedRoute | ActivatedRouteSnapshot): Params {
		const snapshot = routeOrRouteSnapshot instanceof ActivatedRouteSnapshot
			? routeOrRouteSnapshot
			: routeOrRouteSnapshot.snapshot;
		const params = snapshot.url.length ? last(snapshot.url)!.parameters : snapshot.params;

		return pickBy(params, v => !isNil(v));
	}

	private static _mergeRouteParamsAndDeleteNilAndEmptyValues(target: Params, source: Params) {
		return pickBy(
			mapValues(
				{
					...target,
					...source
				},
				v => v?.toString()
			),
			v => !isNil(v) && v !== ''
		);
	}

	static getLastPrimaryRouteQueryParams(route: ActivatedRoute): Params {
		const snapshot = UrlHelper.getLastPrimaryRoute(route.snapshot);

		return pickBy(snapshot.queryParams, v => !isNil(v));
	}

	static getComponentActivatedRoute(route: ActivatedRouteSnapshot | ActivatedRoute, targetRouteCmpt: Type<any>)
		: ActivatedRouteSnapshot | ActivatedRoute | null {
		if (route.routeConfig?.component === targetRouteCmpt)
			return route;

		for (const childRoute of route.children) {
			const cmptRoute = UrlHelper.getComponentActivatedRoute(childRoute, targetRouteCmpt);
			if (cmptRoute)
				return cmptRoute;
		}

		return null;
	}

	static getPrimaryRoutes<T extends ActivatedRouteSnapshot | ActivatedRoute>(route: T): T[] {
		const results = [ route ];
		while (route.firstChild) {
			route = <T> route.firstChild;
			results.push(route);
		}

		return results;
	}

	static getLastPrimaryRoute<T extends ActivatedRouteSnapshot | ActivatedRoute>(route: T): T {
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
			.filter(k => !isNil(params[ k ]) && !Number.isNaN(<number> params[ k ]))
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
