
import { PropertyMetadata } from '../property-metadata';
import { MetadataEntity } from '../metadata-entity';

// tslint:disable-next-line: naming-convention
export function Property(config: Omit<Partial<PropertyMetadata>, 'property'> = <any> {}) {
	return function(model: MetadataEntity, property: string) {
		MetadataEntity
			.getMetadata(model)
			.add(property, config);
	};
}
