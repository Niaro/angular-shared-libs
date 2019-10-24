
import { MetadataEntity } from '../metadata-entity';
import { Control } from './property-metadata-control.decorator';

export function Required() {
	return function (model: MetadataEntity, property: string) {
		Control({ required: true })(model, property);
	};
}
