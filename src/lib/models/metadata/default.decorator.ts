import { MetadataEntity } from './metadata-entity';

export function Default(value: any) {
	return function (model: MetadataEntity, property: string) {
		if (!(model instanceof MetadataEntity))
			throw new Error('The factory decorator can be set only for the class which extends the MetadataEntity class');

		(<typeof MetadataEntity>model.constructor).metadata.defaults[property] = value;
	};
}
