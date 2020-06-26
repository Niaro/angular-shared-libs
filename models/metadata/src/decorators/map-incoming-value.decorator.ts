import { MetadataEntity } from '../metadata-entity';

import { Property } from './property-metadata.decorator';

/**
 * Map the property value from the constructor data parameter
 */
// tslint:disable-next-line: naming-convention
export function MapIncomingValue() {
	return function(model: MetadataEntity, property: string) {
		Property({})(model, property);
	};
}
