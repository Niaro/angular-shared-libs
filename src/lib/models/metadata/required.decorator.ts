
import { MetadataEntity } from './metadata-entity';

export function Required() {
	return function (model: MetadataEntity, property: string) {
		MetadataEntity
			.getMetadata(model)
			.add(property, { required: true });
	};
}
