import { camelCase, snakeCase } from 'lodash-es';
import { first, map } from 'rxjs/operators';

import { Directive, Self } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';

import { ISortQueryParams } from '@bp/shared/models/common';
import { UrlHelper } from '@bp/shared/utilities';

@Directive({
	selector: '[bpSort][matSort]'
})
export class SortDirective {

	constructor(
		@Self() sort: MatSort,
		router: Router,
		route: ActivatedRoute
	) {
		this._setInitialSortStateFromURL(route, sort);
		this._onSortChangeUpdateStateInURL(sort, router, route);
	}

	private _onSortChangeUpdateStateInURL(sort: MatSort, router: Router, route: ActivatedRoute) {
		sort.sortChange
			.pipe(map(({ active, direction }) => (<ISortQueryParams> {
				sortField: direction ? snakeCase(active) : null,
				sortDir: direction
			})))
			.subscribe(params => router.navigate(
				[ UrlHelper.mergeLastPrimaryRouteSnapshotParamsWithSourceParams(route, params) ],
				{ relativeTo: route })
			);
	}

	private _setInitialSortStateFromURL(route: ActivatedRoute, sort: MatSort) {
		route.params
			.pipe(first())
			.subscribe(({ sortField, sortDir }: Partial<ISortQueryParams>) => {
				if (sortField) {
					sort.active = camelCase(sortField);
					sort.direction = sortDir || 'desc';
				}
			});
	}
}
