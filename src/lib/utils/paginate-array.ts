import { IPageQueryParams } from '../models/api';

export function paginateArray(arr: any[] = [], { page, limit }: IPageQueryParams) {
	return page
		? arr.slice((+page - 1) * +limit, +page * +limit)
		: arr.slice(0, +limit);
}
