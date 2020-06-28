
import { MetadataEntity } from '../metadata-entity';

import { Property } from './property-metadata.decorator';

// tslint:disable-next-line: naming-convention
export function UnderDevelopment() {
	return function(model: MetadataEntity, property: string) {
		Property({ underDevelopment: true })(model, property);
	};
}
