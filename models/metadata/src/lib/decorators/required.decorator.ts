
import { MetadataEntity } from '../metadata-entity';
import { Control } from './control.decorator';

// tslint:disable-next-line: naming-convention
export function Required() {
	return function(model: MetadataEntity, property: string) {
		Control({ required: true })(model, property);
	};
}
