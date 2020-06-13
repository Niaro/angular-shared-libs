
import { ValidatorFn } from '@angular/forms';

import { MetadataEntity } from '../metadata-entity';
import { Control } from './control.decorator';

// tslint:disable-next-line: naming-convention
export function Validator(validator: ValidatorFn) {
	return function(model: MetadataEntity, property: string) {
		Control({ validator })(model, property);
	};
}
