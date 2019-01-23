import * as m from 'moment';
import { isNil, assign, isString } from 'lodash-es';

import { chain } from '@bp/shared/utils';

const RANGE_DELIMITER = ':';

export type DateRangeInput = { from?: m.MomentInput, to?: m.MomentInput };

export class DateRange {

	/**
	 * Parse string 'unix:unix' to DateRange
	 */
	static parse(value: string) {
		const [from, to] = chain(value)
			.split(RANGE_DELIMITER)
			.chunk(2)
			.map(dates => dates.map(d => d && m.unix(+d)))
			.map(dates => dates.map(d => d && d.isValid() ? d : null))
			.flatten<m.Moment | null>()
			.value();

		return new DateRange({ from, to });
	}

	get from() { return this._from; }
	set from(value) {
		this._from = this.parseMoment(value);
		this.fromFormatted = this._from && this._from.format('LL');
		this.setUnixText();
	}
	fromFormatted: string;

	get to() { return this._to; }
	set to(value) {
		this._to = this.parseMoment(value);
		this.toFormatted = this._to && this._to.format('LL');
		this.setUnixText();
	}
	toFormatted: string;

	get empty() { return isNil(this.from) && isNil(this.to); }

	private _from: m.Moment;
	private _to: m.Moment;
	private unixText: string;

	constructor(config?: DateRangeInput | string) {
		if (isString(config))
			return DateRange.parse(config);

		assign(this, config);
		Object.freeze(this);
	}

	clone() {
		return new DateRange(this);
	}

	valueOf(): any {
		return this.unixText;
	}

	unix() {
		return {
			from: this.from && this.from.unix(),
			to: this.to && this.to.unix()
		};
	}

	toJSON() {
		if (!this._from && !this._to)
			return null;
		return {
			from: this._from ? this._from.toJSON() : null,
			to: this._to ? this._to.toJSON() : null
		};
	}

	private setUnixText() {
		const from = this.getUnixString(this._from);
		const to = this.getUnixString(this._to);
		this.unixText = from || to ? `${from}${RANGE_DELIMITER}${to}` : undefined;
	}

	private getUnixString(moment: m.Moment) {
		return moment ? moment.format('X') : '';
	}

	private parseMoment(value?: m.MomentInput): m.Moment {
		return value && (m.isMoment(value) ? value : m(value));
	}
}
