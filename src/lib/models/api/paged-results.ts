import { assign } from 'lodash-es';

export class PagedResults<T = any> {
	nextPageCursor!: string | null;

	firstPage!: boolean;

	records!: T[];

	constructor(data: Partial<PagedResults<T>>) {
		assign(this, data);
	}
}
