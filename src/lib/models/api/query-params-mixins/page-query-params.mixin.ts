import { Constructor } from './constructor';
import { QueryParamsBase } from './query-params-base';

export const PAGE_SIZE = 25;

export interface IPageQueryParams {
	page?: string;
	limit: string;
}

export type PageQueryParamsCtor = Constructor<IPageQueryParams>;

export function mixinPageQueryParams<T extends Constructor<QueryParamsBase<{ pageSize: string, page: string }>>>
	(base: T, defaultPageSize = PAGE_SIZE): PageQueryParamsCtor & T {
	return class extends base {
		page?: string;
		limit: string;

		constructor(...args: any[]) {
			super(...args);
			this.limit = this.routeParams.pageSize || defaultPageSize.toString();
			this.page = this.routeParams.page;
		}
	};
}
