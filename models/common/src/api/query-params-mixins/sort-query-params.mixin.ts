import { SortDirection } from '@angular/material/sort';

import { Constructor } from './constructor';
import { QueryParamsBase } from './query-params-base';

export interface ISortQueryParams {
	sortField: string;
	sortDir: SortDirection;
}

export type SortQueryParamsCtor = Constructor<ISortQueryParams>;

type BaseSortQueryParams = Constructor<QueryParamsBase<ISortQueryParams>>;

export function mixinSortQueryParams<T extends BaseSortQueryParams>(base: T): SortQueryParamsCtor & T {
	return class extends base {
		sortField!: string;
		sortDir!: SortDirection;

		constructor(...args: any[]) {
			super(...args);

			if (this._routeParams.sortField) {
				this.sortField = this._routeParams.sortField;
				this.sortDir = <SortDirection> this._routeParams.sortDir || 'desc';
			}
		}
	};
}
