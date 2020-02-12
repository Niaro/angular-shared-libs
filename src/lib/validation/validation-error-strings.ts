import { isObject, isString, flatMap, compact } from 'lodash-es';
import { TranslateService } from '@ngx-translate/core';

import { IValidationErrors, ValidationError, ValidationErrorTemplateVariables } from './models';

export class ValidationErrorStrings extends Array<string> {
	constructor(errors: IValidationErrors, translate?: TranslateService) {
		super();

		const errorStrings: Dictionary<string> = translate
			? translate.instant('error')
			: require('../../../../../apps/widget/src/assets/i18n/en.json').error;

		function getErrorString(validatorName: string, error?: ValidationError) {
			if (isString(error))
				return error;

			const value = errorStrings[validatorName];

			if (isObject(error)) {
				const masks = value.match(/{{(\w+)}}/g);
				return masks
					? masks
						.map(v => ({
							mask: v,
							maskValue: error[<keyof ValidationErrorTemplateVariables>v.replace(/({{|}})/g, '')]
						}))
						.reduce(
							(txt, { mask, maskValue }) => maskValue ? txt.replace(mask, maskValue.toString()) : txt,
							value
						)
					: value;
			}

			return value;
		}

		// in case if we have an error for the control but don't have
		// predefined error msg for the error we get [undefined], thus we compact it
		return compact(flatMap(errors, (error, validatorName) => getErrorString(validatorName, error)));
	}
}
