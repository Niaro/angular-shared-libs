import { MetadataEntity } from '../metadata-entity';
import { PropertyMapper } from '../property-metadata';
import { Property } from './property-metadata.decorator';

// tslint:disable-next-line: naming-convention
export function Mapper(mapper: PropertyMapper) {
	return function(model: MetadataEntity, property: string) {
		Property({ mapper })(model, property);
	};
}
