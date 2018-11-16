import { isObject } from 'lodash-es';

import { chain } from '../utils/chain';
import { IValidationErrors, IValidationError } from './models';

export class ValidationErrorStrings extends Array<string> {
	constructor(controlName: string, errors: IValidationErrors) {
		super();
		return (
			chain(errors)
				.flatMap((error, validatorName) =>
					getErrorString(controlName, validatorName, error)
				)
				// in case if we have an error for the control but don't have
				// predefined error msg for the error we get [undefined], thus we compact it
				.compact()
				.value()
		);
	}
}

const ERROR_STRINGS = require('./validation-errors.en.json');

function getErrorString(
	controlName: string,
	validatorName: string,
	config?: IValidationError | null
) {
	const value = ERROR_STRINGS[validatorName];
	const text = isObject(value) ? value[controlName] || value.default : value;

	const masks = text.match(/{{(\w+)}}/g);
	return masks
		? masks.reduce((txt, mask) => txt.replace(mask, config[mask.replace(/({{|}})/g, '')]), text)
		: text;
}
