import { isObject, isString, compact, flatMap } from 'lodash-es';
import { TranslateService } from '@ngx-translate/core';

import { IValidationErrors, IValidationError } from './models';

export class ValidationErrorStrings extends Array<string> {
	constructor(controlName: string, errors: IValidationErrors, translate?: TranslateService) {
		super();

		const ERROR_STRINGS = translate
			? translate.instant('error')
			: require('../../../../../apps/widget/src/assets/i18n/en.json').error;

		function getErrorString(validatorName: string, error?: IValidationError | string | true) {
			if (isString(error))
				return error;

			const value = ERROR_STRINGS[validatorName];

			const text = isObject(value)
				? value[controlName] || value['default']
				: value;

			if (!text)
				console.log('missed error', validatorName, controlName);

			const masks = text.match(/{{(\w+)}}/g);
			return masks
				? masks.reduce((txt, mask) => txt.replace(mask, error[mask.replace(/({{|}})/g, '')]), text)
				: text;
		}

		// in case if we have an error for the control but don't have
		// predefined error msg for the error we get [undefined], thus we compact it
		return compact(flatMap(errors, (error, validatorName) => getErrorString(validatorName, error)));
	}
}
