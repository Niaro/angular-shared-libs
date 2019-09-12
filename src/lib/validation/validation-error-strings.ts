import { isObject, isString, flatMap, compact } from 'lodash-es';
import { TranslateService } from '@ngx-translate/core';
import { Dictionary } from 'lodash';

import { IValidationErrors, ValidationError, ValidationErrorTemplateVariables } from './models';

export class ValidationErrorStrings extends Array<string> {
	constructor(controlName: string, errors: IValidationErrors, translate?: TranslateService) {
		super();

		const ERROR_STRINGS: Dictionary<string | Dictionary<string>> = translate
			? translate.instant('error')
			: require('../../../../../apps/widget/src/assets/i18n/en.json').error;

		function getErrorString(validatorName: string, error?: ValidationError) {
			if (isString(error))
				return error;

			const value = ERROR_STRINGS[validatorName];

			const text = isObject(value)
				? value[controlName] || value['default']
				: value;

			if (!text)
				console.log('missed error', validatorName, controlName);

			if (isObject(error)) {
				const masks = text.match(/{{(\w+)}}/g);
				return masks
					? masks
						.map(v => ({
							mask: v,
							maskValue: error[v.replace(/({{|}})/g, '') as keyof ValidationErrorTemplateVariables]
						}))
						.reduce(
							(txt, { mask, maskValue }) => maskValue ? txt.replace(mask, maskValue.toString()) : txt,
							text
						)
					: text;
			}

			return text;
		}

		// in case if we have an error for the control but don't have
		// predefined error msg for the error we get [undefined], thus we compact it
		return compact(flatMap(errors, (error, validatorName) => getErrorString(validatorName, error)));
	}
}
