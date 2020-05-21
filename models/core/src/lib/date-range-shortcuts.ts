import m from 'moment';

import { Enumeration } from './enums';
import { DateRange } from './date-range';

export class DateRangeShortcut extends Enumeration {

	static week = new DateRangeShortcut();

	static month = new DateRangeShortcut();

	static quarter = new DateRangeShortcut();

	static year = new DateRangeShortcut();

	dateRange!: DateRange;

	constructor() {
		super();

		Promise.resolve().then(() => {
			this.dateRange = this._getDateRange()!;
			setInterval(() => this.dateRange = this._getDateRange()!, 24 * 60 * 60 * 1000);
		});
	}

	private _getDateRange() {
		const to = m().endOf('day');

		switch (this) {
			case DateRangeShortcut.week:
				return new DateRange({ to, from: m().utc().startOf('week') });
			case DateRangeShortcut.month:
				return new DateRange({ to, from: m().utc().startOf('month') });
			case DateRangeShortcut.quarter:
				return new DateRange({ to, from: m().utc().startOf('quarter') });
			case DateRangeShortcut.year:
				return new DateRange({ to, from: m().utc().startOf('year') });
		}

		throw new Error('DateRange for the DateRangeShortcut is not implemented');
	}
}
