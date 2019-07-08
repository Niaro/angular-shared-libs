import { SortDirection } from '@angular/material/sort';
import { Constructor } from './constructor';
import { QueryParamsBase } from './query-params-base';

export interface ISortQueryParams {
	sortField: string;
	sortDir: SortDirection;
}

export type SortQueryParamsCtor = Constructor<ISortQueryParams>;

export function mixinSortQueryParams<T extends Constructor<QueryParamsBase<ISortQueryParams>>>(base: T): SortQueryParamsCtor & T {
	return class extends base {
		sortField: string;
		sortDir: SortDirection;

		constructor(...args: any[]) {
			super(...args);

			if (this.routeParams.sortField) {
				this.sortField = this.routeParams.sortField;
				this.sortDir = this.routeParams.sortDir || 'desc';
			}
		}
	};
}
