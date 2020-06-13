import { assign, chunk, isNil, isString, omit } from 'lodash-es';
import m from 'moment';

const RANGE_DELIMITER = ':';

export type DateRangeInput = {
	from?: m.MomentInput;
	to?: m.MomentInput;
};

export type DateRangeInputValue = DateRange | DateRangeInput | string;

export class DateRange {

	/**
	 * Parse string 'unix:unix' to DateRange
	 */
	static parseString(value: string, format?: string) {
		const [ from, to ] = chunk(value.split(RANGE_DELIMITER), 2)
			.map(dates => dates.map(d => d && m.unix(+d).utc()))
			.map(dates => dates.map(d => d && d.isValid() ? d : undefined))
			.flat();

		return new DateRange({ from, to }, format);
	}

	static parse(value: DateRangeInputValue, format?: string) {
		return value instanceof DateRange ? value : new DateRange(value, format);
	}

	get from() { return this._from; }
	set from(value) {
		this._from = value && this._parseMoment(value);
		this.fromFormatted = this._from && this._from.format(this._format);
		this._setUnixText();
	}
	fromFormatted: string | undefined;

	get to() { return this._to; }
	set to(value) {
		this._to = value && this._parseMoment(value);
		this.toFormatted = this._to && this._to.format(this._format);
		this._setUnixText();
	}
	toFormatted: string | undefined;

	get empty() { return isNil(this.from) && isNil(this.to); }

	get fullRange() { return !!this.from && !!this.to; }

	private _from: m.Moment | undefined;

	private _to: m.Moment | undefined;

	private _unixText!: string | undefined;

	private _format!: string;

	constructor(
		config?: DateRangeInput | string,
		format = 'LL'
	) {
		this._format = format;

		if (isString(config))
			return DateRange.parseString(config, format);

		assign(this, omit(config, [ 'empty', 'fullRange', 'format' ]));
		Object.freeze(this);
	}

	clone() {
		return new DateRange(this, this._format);
	}

	toString(): any {
		return this._unixText;
	}

	valueOf(): any {
		return this._unixText;
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

	isSame(other: DateRange) {
		return this._unixText === other._unixText;
	}

	private _setUnixText() {
		const from = this._getUnixString(this._from);
		const to = this._getUnixString(this._to);
		this._unixText = from || to ? `${ from }${ RANGE_DELIMITER }${ to }` : undefined;
	}

	private _getUnixString(moment?: m.Moment) {
		return moment ? moment.format('X') : '';
	}

	private _parseMoment(value: m.MomentInput): m.Moment {
		return m.isMoment(value) ? value : m(value);
	}
}
