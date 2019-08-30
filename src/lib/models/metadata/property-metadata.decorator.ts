
import { PropertyMetadata } from './property-metadata';
import { MetadataEntity } from './metadata-entity';
import { startCase } from 'lodash-es';

export function Property(config: Omit<Partial<PropertyMetadata>, 'property'> = <any>{}) {
	return function (model: MetadataEntity, property: string) {
		MetadataEntity
			.getMetadata(model)
			.add(property, {
				label: config.label || startCase(property),
				...config
			});
	};
}
