
import { PropertyMetadata } from './property-metadata';
import { MetadataEntity } from './metadata-entity';
import { upperFirst } from 'lodash-es';
import { Omit } from '../misc/typescript-types';

export function Property(config: Omit<PropertyMetadata, 'property'> = <any>{}) {
	return function (model: MetadataEntity, property: string) {
		if (!(model instanceof MetadataEntity))
			throw new Error('The property decorator can be set only for the class which extends the MetadataEntity class');

		config.label = config.label || upperFirst(property);
		(<typeof MetadataEntity>model.constructor).metadata.push(new PropertyMetadata({ ...config, property }));
	};
}
