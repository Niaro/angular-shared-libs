import { MetadataEntity } from '../metadata-entity';
import { Property } from './property-metadata.decorator';

export function Default(value: any) {
	return function (model: MetadataEntity, property: string) {
		Property({ default: value })(model, property);
	};
}
