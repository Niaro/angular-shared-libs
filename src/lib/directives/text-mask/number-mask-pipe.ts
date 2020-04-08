import { isNumber } from 'lodash-es';
import { NumberMaskConfig } from './text-mask.config';
import { MaskPipe } from './mask-pipe';

const NON_DIGITS_REGEXP = /\D+/g;
const DIGIT_REGEXP = /\d/;

export class NumberMaskPipe extends MaskPipe {

	get thousandsSeparatorSymbolLength() {
		return this.config.thousandsSeparatorSymbol && this.config.thousandsSeparatorSymbol.length || 0;
	}

	decimalSymbolRegExp: RegExp;

	digitRegExp = DIGIT_REGEXP;

	constructor(public config = new NumberMaskConfig()) {
		super(config);
		this.decimalSymbolRegExp = new RegExp(`\\${ this.config.decimalSeparatorSymbol }`);
	}

	protected _transformBody(rawValue: string) {
		if (rawValue === '' || (rawValue[ 0 ] === this.prefix[ 0 ] && rawValue.length === 1))
			return [ DIGIT_REGEXP ];

		if (rawValue === this.config.decimalSeparatorSymbol && this.config.allowDecimal)
			return [ '0', this.decimalSymbolRegExp, DIGIT_REGEXP ];

		let integer;
		let fraction!: string | (string | RegExp)[];
		let mask: (string | RegExp)[];
		const refinedValue = integer = this._removePrefixAndSuffix(rawValue);

		const indexOfLastDecimal = refinedValue.lastIndexOf(this.config.decimalSeparatorSymbol);
		const hasDecimal = indexOfLastDecimal !== -1;
		const isNegative = (refinedValue[ 0 ] === '-') && this.config.allowNegative;

		if (hasDecimal && (this.config.allowDecimal || this.config.requireDecimal)) {
			integer = refinedValue.slice(0, indexOfLastDecimal);
			fraction = refinedValue.slice(indexOfLastDecimal + 1, refinedValue.length);
			fraction = this._convertToMask(fraction.replace(NON_DIGITS_REGEXP, ''));
		}

		if (isNumber(this.config.integerLimit)) {
			const thousandsSeparatorRegex = this.config.thousandsSeparatorSymbol === '.' ? '[.]' : `${ this.config.thousandsSeparatorSymbol }`;
			const numberOfThousandSeparators = (integer.match(new RegExp(thousandsSeparatorRegex, 'g')) || []).length;

			integer = integer.slice(
				0,
				this.config.integerLimit + (numberOfThousandSeparators * this.thousandsSeparatorSymbolLength)
			);
		}

		integer = integer.replace(NON_DIGITS_REGEXP, '');

		if (!this.config.allowLeadingZeroes)
			integer = integer.replace(/^0+(0$|[^0])/, '$1');

		integer = this.config.includeThousandsSeparator
			? this._addThousandsSeparator(integer)
			: integer;

		mask = integer ? this._convertToMask(integer) : [ DIGIT_REGEXP ];

		if ((hasDecimal && this.config.allowDecimal) || this.config.requireDecimal === true) {
			if (refinedValue[ indexOfLastDecimal - 1 ] !== this.config.decimalSeparatorSymbol)
				mask.push(this.caretTrap);

			mask.push(this.decimalSymbolRegExp, this.caretTrap);

			if (fraction) {
				if (isNumber(this.config.decimalLimit))
					fraction = fraction.slice(0, this.config.decimalLimit);

				mask = mask.concat(fraction);
			}

			if (this.config.requireDecimal === true
				&& refinedValue[ indexOfLastDecimal - 1 ] === this.config.decimalSeparatorSymbol
			)
				mask.push(DIGIT_REGEXP);
		}

		if (isNegative)
			// If user is entering a negative number, add a mask placeholder spot to attract the caret to it.
			mask = [ /-/, ...mask ];

		return mask;
	}

	private _convertToMask(text: string) {
		return text
			.split('')
			.map(char => DIGIT_REGEXP.test(char) ? DIGIT_REGEXP : char);
	}

	// http://stackoverflow.com/a/10899795/604296
	private _addThousandsSeparator(n: { replace: (arg0: RegExp, arg1: string) => void; }) {
		return n.replace(/\B(?=(\d{3})+(?!\d))/g, this.config.thousandsSeparatorSymbol);
	}
}
