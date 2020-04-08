
import { MetadataEntity } from '../metadata-entity';
import { Property } from './property-metadata.decorator';
import { PropertyMapper } from '../property-metadata';

// tslint:disable-next-line: naming-convention
export function Mapper(mapper: PropertyMapper) {
	return function(model: MetadataEntity, property: string) {
		Property({ mapper })(model, property);
	};
}
