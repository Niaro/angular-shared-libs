import { MaskPipe } from './mask-pipe';
import { TextMaskConfig, TextMask } from './text-mask.config';
import { isFunction, isEmpty } from 'lodash-es';

export class TextMaskPipe extends MaskPipe {
	constructor(config: TextMaskConfig) {
		super(config);
	}

	transformBody(rawValue: string): TextMask | undefined {
		const resolvedMask = isFunction(this.mask) ? this.mask(rawValue) : this.mask;

		if (!resolvedMask && this.prefixLength === 0 && this.suffixLength === 0)
			return;

		this.formatChars = resolvedMask
			? resolvedMask
				.filter(char => !(char instanceof RegExp))
				.concat(this.config.placeholderChar) as string[]
			: [];

		if (this.prefixLength === 0 && this.suffixLength === 0 || rawValue === '' || (rawValue[0] === this.prefix[0] && rawValue.length === 1))
			return resolvedMask || [null];

		const refinedValue = resolvedMask
			? undefined
			: this.removePrefixAndSuffix(rawValue);

		const maskFromRefinedValue = isEmpty(refinedValue)
			? [null]
			: refinedValue!.split('').map(char => /./);

		return resolvedMask || maskFromRefinedValue;
	}
}
