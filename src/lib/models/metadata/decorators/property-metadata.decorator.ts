
import { PropertyMetadata } from '../property-metadata';
import { MetadataEntity } from '../metadata-entity';

export function Property(config: Omit<Partial<PropertyMetadata>, 'property'> = <any>{}) {
	return function (model: MetadataEntity, property: string) {
		MetadataEntity
			.getMetadata(model)
			.add(property, config);
	};
}
