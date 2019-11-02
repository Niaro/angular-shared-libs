import { assign } from 'lodash-es';

export class PropertyMetadataTable {

	/**
	 * The header for this column is spanned with the next column header
	 */
	headless = false;

	/**
	 * The column is always present on the table, can't be unselected under the show more btn
	 */
	alwaysShown = false;

	/**
	 * By default the column is not shown, but can be selected under the show more button
	 */
	optional = false;

	sortable = false;

	/**
	 * Ellipsis the content and adds a tooltip
	 */
	ellipsis = false;

	constructor(data?: Partial<PropertyMetadataTable>) {
		assign(this, data);
	}

}
