import { assign } from 'lodash-es';

export class PropertyMetadataTable {

	/**
	 * The header for this column is spanned with the next column header
	 */
	readonly headless: boolean = false;

	/**
	 * The column is always present on the table, can't be unselected under the show more btn
	 */
	readonly alwaysShown: boolean = false;

	/**
	 * By default the column is not shown, but can be selected under the show more button
	 */
	readonly optional: boolean = false;

	readonly sortable: boolean = false;

	/**
	 * Ellipsis the content and adds a tooltip
	 */
	readonly ellipsis: boolean = false;

	constructor(data?: Partial<PropertyMetadataTable>) {
		assign(this, data);
	}

}
