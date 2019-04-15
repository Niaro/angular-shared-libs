
import { Enumeration } from '../misc';
import { MetadataEntity } from './metadata-entity';

export function Mapper(cb: ((value: any, data: any, self: any) => any) | typeof Enumeration | typeof MetadataEntity) {
	return function (model: MetadataEntity, property: string) {
		MetadataEntity
			.getMetadata(model)
			.add(property, { mapper: cb });
	};
}
