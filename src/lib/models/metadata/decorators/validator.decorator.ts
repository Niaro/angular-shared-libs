
import { ValidatorFn } from '@angular/forms';

import { MetadataEntity } from '../metadata-entity';
import { Control } from './control.decorator';

export function Validator(validator: ValidatorFn) {
	return function (model: MetadataEntity, property: string) {
		Control({ validator })(model, property);
	};
}
