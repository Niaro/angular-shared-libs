import m from 'moment';

import { DateRange } from './date-range';
import { Describable } from './enums';

export class DateRangeShortcut extends Describable {

	static week = new DateRangeShortcut();

	static month = new DateRangeShortcut();

	static quarter = new DateRangeShortcut();

	static year = new DateRangeShortcut();

	dateRange!: DateRange;

	constructor() {
		super();

		// deepcode ignore PromiseNotCaughtGeneral: <please specify a reason of ignoring this>
		Promise
			.resolve()
			.then(() => {
				this.dateRange = this._getDateRange()!;
				this.description = `From the beginning of the current ${ this.displayName.toLowerCase() } to this day`;

				setInterval(() => this.dateRange = this._getDateRange()!, 24 * 60 * 60 * 1000);
			});
	}

	private _getDateRange() {
		const to = m()
			.endOf('day');

		switch (this) {
			case DateRangeShortcut.week:
				return new DateRange({
					to,
					from: m()
						.utc()
						.startOf('week')
				});

			case DateRangeShortcut.month:
				return new DateRange({
					to,
					from: m()
						.utc()
						.startOf('month')
				});

			case DateRangeShortcut.quarter:
				return new DateRange({
					to,
					from: m()
						.utc()
						.startOf('quarter')
				});

			case DateRangeShortcut.year:
				return new DateRange({
					to,
					from: m()
						.utc()
						.startOf('year')
				});
		}

		throw new Error('DateRange for the DateRangeShortcut is not implemented');
	}
}
