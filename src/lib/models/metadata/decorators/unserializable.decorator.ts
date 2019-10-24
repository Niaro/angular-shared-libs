
import { MetadataEntity } from '../metadata-entity';
import { Property } from './property-metadata.decorator';

export function Unserializable() {
	return function (model: MetadataEntity, property: string) {
		Property({ unserializable: true })(model, property);
	};
}
