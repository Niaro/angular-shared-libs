import { assign, escapeRegExp } from 'lodash-es';

export class TextMaskConfig {
	/**
	 * Is an array or a function that defines how the user input is going to be masked.
	 * @link https://git.io/v1pTT
	 */
	mask: TextMask | TextMaskFn;

	get prefix(): string { return this['_prefix_']; }
	set prefix(value: string) {
		this['_prefix_'] = value;
		(<any>this).prefixRegExp = value && value.length && new RegExp(`^${escapeRegExp(value)}`) || undefined;
	}

	get suffix(): string { return this['_suffix_']; }
	set suffix(value: string) {
		this['_suffix_'] = value;
		(<any>this).suffixRegExp = value && value.length && new RegExp(`${escapeRegExp(value)}$`) || undefined;
	}

	readonly prefixRegExp: RegExp;
	readonly suffixRegExp: RegExp;

	includeMaskInValue = false;

	/**
	 * Is a boolean that tells the component whether to be in guide or no guide mode.
	 * @default true
	 * @link https://git.io/v1pTe
	 */
	guide = true;

	/**
	 * The placeholder character represents the fillable spot in the mask.
	 * @default The default placeholder character is underscore `_`
	 * For example, with mask...
	 * ```js
	 * ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
	 * ```
	 * the user would fill out `(___) ___-____`.
	 * @link https://git.io/v1pTB
	 */
	placeholderChar = '_';

	placeholderFromMask = true;

	placeholder: string;

	maskOnFocus = true;

	/**
	 * Changes the general behavior of the Text Mask component.
	 * When true, adding or deleting characters will not affect the positions of existing characters.
	 * When false, adding characters causes existing characters to advance. And deleting characters causes existing characters to move back.
	 * @default false
	 * @link https://git.io/v1pT4
	 */
	keepCharPositions = false;

	/**
	 * You can provide a pipe function that will give you the opportunity to modify the conformed value before it is displayed on the screen.
	 * @link https://git.io/v1pk1
	 */
	pipe: (conformedValue: string, config: TextMaskConfig) => boolean | string | { value: string, indexesOfPipedChars: number[] };

	/**
	 * You can provide an onAccept callback function which will be called when the user enters a character that is accepted
	 * and displayed on the input element.
	 * @link https://git.io/v1pkh
	 */
	onAccept: () => void;

	/**
	 * You can provide an onReject callback function which will be called when the user tries to enter a character
	 * that ends up being rejected either by the mask or by the pipe and not displayed on the input element.
	 * @link https://git.io/v1pkx
	 */
	onReject: (conformedValue: string, maskRejection: boolean, pipeRejection: boolean) => boolean;

	constructor(config?: Partial<TextMaskConfig>) {
		this.assign(config);
	}

	assign(config: Partial<TextMaskConfig>) {
		assign(this, config);
		return this;
	}
}

export class NumberMaskConfig extends TextMaskConfig {
	prefix = '';

	suffix = '';

	/**
	 * @default 'whitespace'
	 */
	placeholderChar = '\u2000'; // whitespace

	/**
	 * @default false
	 */
	placeholderFromMask = false;

	/**
	 * @default false
	 */
	maskOnFocus = false;

	/**
	 *  Whether or not to separate thousands.
	 *  @default true
	 */
	includeThousandsSeparator = true;

	/**
	 * Character with which to separate thousands
	 * @default ' '
	 */
	thousandsSeparatorSymbol = ' ';

	/**
	 * Whether or not to allow the user to enter a fraction with the amount
	 * @default false
	 */
	allowDecimal = false;

	/**
	 * Character that acts as a decimal point
	 * @default separator of current culture
	 */
	decimalSeparatorSymbol = this.getLocaleDecimalSeparatorSymbol();

	/**
	 * How many digits to allow after the decimal
	 * @default 2
	 */
	decimalLimit = 2;

	decimalMinimumLimit = 0;

	/**
	 * How many digits to allow before the decimal
	 * @default null
	 */
	integerLimit: number = null;

	/**
	 * Whether or not to always include a decimal point and placeholder for decimal digits after the integer
	 * @default false
	 */
	requireDecimal = false;

	/**
	 * Whether or not to allow negative numbers
	 * @default false
	 */
	allowNegative = false;

	/**
	 * Whether or not to allow leading zeroes.
	 * @default false
	 */
	allowLeadingZeroes = false;

	/**
	 * Empty value will be converted to zero.
	 * @default false
	 */
	emptyIsZero = false;

	get decimalSeparatorRegExp() {
		return this['_decimalSeparatorRegExp_']
			|| (this['_decimalSeparatorRegExp_'] = new RegExp(escapeRegExp(this.decimalSeparatorSymbol), 'g'));
	}

	get integersSeparatorRegExp() {
		return this['_separatorRegExp_']
			|| (this['_separatorRegExp_'] = new RegExp(escapeRegExp(this.thousandsSeparatorSymbolw), 'g'));
	}

	get leadingZeroRegExp() {
		return this['_leadingZeroRegExp_']
			|| (this['_leadingZeroRegExp_'] = new RegExp(`^([0${escapeRegExp(this.thousandsSeparatorSymbol)}]+)[1-9]`));
	}

	constructor(config?: Partial<NumberMaskConfig>) {
		super();
		this.assign(config);
	}

	assign(config: Partial<NumberMaskConfig>) {
		return super.assign(config);
	}

	private getLocaleDecimalSeparatorSymbol(): string {
		return 1.1.toLocaleString().substring(1, 2);
	}
}

export type TextMask = (string | RegExp)[];
export type TextMaskFn = (rawValue: string) => TextMask;
