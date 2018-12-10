
import { Enumeration } from '../misc';
import { MetadataEntity } from './metadata-entity';

export function Mapper(cb: ((value: any, data: any, self: any) => any) | typeof Enumeration | typeof MetadataEntity) {
	return function (model: MetadataEntity, property: string) {
		if (!(model instanceof MetadataEntity))
			throw new Error('The factory decorator can be set only for the class which extends the MetadataEntity class');

		(<typeof MetadataEntity>model.constructor).metadata.mappers[property] = cb;
	};
}
