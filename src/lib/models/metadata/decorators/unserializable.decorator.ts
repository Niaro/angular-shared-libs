
import { MetadataEntity } from '../metadata-entity';
import { Property } from './property-metadata.decorator';

// tslint:disable-next-line: naming-convention
export function Unserializable() {
	return function (model: MetadataEntity, property: string) {
		Property({ unserializable: true })(model, property);
	};
}
