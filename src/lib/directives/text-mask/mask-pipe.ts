import { TextMaskConfig, TextMask } from './text-mask.config';
import { isNil, isUndefined } from 'lodash-es';

export abstract class MaskPipe {
	readonly prefix: string;
	readonly suffix: string;
	readonly prefixLength: number;
	readonly suffixLength: number;
	readonly caretTrap = '[]';

	formatChars = [];

	get mask() { return this.config.mask; }
	get prefixRegExp() { return this.config.prefixRegExp; }
	get suffixRegExp() { return this.config.suffixRegExp; }

	constructor(public config = new TextMaskConfig()) {
		this.prefix = isNil(config.prefix) ? '' : config.prefix;
		this.suffix = isNil(config.suffix) ? '' : config.suffix;

		this.prefixLength = this.prefix.length;
		this.suffixLength = this.suffix.length;
	}

	transform(rawValue: string): TextMask {
		rawValue = isNil(rawValue) ? '' : rawValue;
		return this.tryAddPrefixAndSuffix(this.transformBody(rawValue))
			.filter(char => !isUndefined(char));
	}

	protected abstract transformBody(rawValue: string): TextMask;

	/**
	 * Method is getting rid of prefix and suffix chars from input value
	 */
	protected removePrefixAndSuffix(rawValue: string) {
		const refinedRawValue = this.prefixRegExp && this.prefixRegExp.test(rawValue)
			? rawValue.substring(this.prefixLength)
			: rawValue;
		return this.suffixRegExp && this.suffixRegExp.test(refinedRawValue)
			? refinedRawValue.substring(0, refinedRawValue.length - this.suffixLength)
			: refinedRawValue;
	}

	protected tryAddPrefixAndSuffix(mask: TextMask): TextMask {
		if (this.prefixLength > 0)
			mask = this.prefix.split('').concat(<any>mask);

		if (this.suffixLength > 0)
			mask = mask.concat(this.suffix.split(''));

		return mask;
	}
}
