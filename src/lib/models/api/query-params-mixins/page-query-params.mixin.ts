import { Constructor } from './constructor';
import { QueryParamsBase } from './query-params-base';

export const PAGE_SIZE = 24;

export interface IPageQueryParams {
	page?: string;
	limit: number;
}

export type PageQueryParamsCtor = Constructor<IPageQueryParams>;

export function mixinPageQueryParams<T extends Constructor<QueryParamsBase<{ pageSize: string, page: string }>>>
	(base: T, defaultPageSize = PAGE_SIZE): PageQueryParamsCtor & T {
	return class extends base {
		page?: string;
		limit: number;

		constructor(...args: any[]) {
			super(...args);
			this.limit = +(this._routeParams.pageSize || defaultPageSize);
			this.page = this._routeParams.page;
		}
	};
}
