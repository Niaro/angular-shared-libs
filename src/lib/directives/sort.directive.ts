import { Directive, Self } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { snakeCase, camelCase } from 'lodash-es';
import { map, first } from 'rxjs/operators';

import { UrlHelper } from '@bp/shared/utils';
import { ISortQueryParams } from '../models';

@Directive({
	selector: '[bpSort][matSort]'
})
export class SortDirective {
	constructor(
		@Self() sort: MatSort,
		router: Router,
		route: ActivatedRoute
	) {
		route.params
			.pipe(first())
			.subscribe(({ sortField, sortDir }: Partial<ISortQueryParams>) => {
				if (sortField) {
					sort.active = camelCase(sortField);
					sort.direction = sortDir || 'desc';
				}
			});

		sort.sortChange
			.pipe(map(({ active, direction }) => (<ISortQueryParams>{
				sortField: direction ? snakeCase(active) : null,
				sortDir: direction
			})))
			.subscribe(params => router.navigate(
				[UrlHelper.mergeRouteParams(route, params)],
				{ relativeTo: route })
			);
	}
}
