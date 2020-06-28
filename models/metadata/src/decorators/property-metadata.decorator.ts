import { MetadataEntity } from '../metadata-entity';
import { PropertyMetadata } from '../property-metadata';

// tslint:disable-next-line: naming-convention
export function Property(config: Omit<Partial<PropertyMetadata>, 'property'>) {
	return function(model: MetadataEntity, property: string) {
		MetadataEntity
			.getMetadata(model)
			.add(property, config);
	};
}
