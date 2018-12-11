export const QUERY_PARAMS_KEY = 'queryParams';

export interface ISortQueryParams {
	sortField?: string;
	sortDir?: 'DESC' | 'ASC';
}

export const PAGE_SIZE = 25;

export interface IPageQueryParams {
	page?: string;
	limit: number;
}

export interface IDaterangeQueryParams {
	from?: number;
	to?: number;
}
