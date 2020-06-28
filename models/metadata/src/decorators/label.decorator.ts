import { MetadataEntity } from '../metadata-entity';

import { Property } from './property-metadata.decorator';

// tslint:disable-next-line: naming-convention
export function Label(label: string) {
	return function(model: MetadataEntity, property: string) {
		Property({ label })(model, property);
	};
}
