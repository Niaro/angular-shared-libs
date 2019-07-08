
import { MetadataEntity } from './metadata-entity';

export function Unserializable() {
	return function (model: MetadataEntity, property: string) {
		MetadataEntity
			.getMetadata(model)
			.add(property, { unserializable: true });
	};
}
