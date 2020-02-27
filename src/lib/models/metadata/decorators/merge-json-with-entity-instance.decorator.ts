import { MetadataEntity } from '../metadata-entity';
import { Property } from './property-metadata.decorator';
import { MERGE_JSON_WITH_ENTITY_INSTANCE_TOKEN } from './merge-json-with-entity-instance.token';

// tslint:disable-next-line: naming-convention
export function MergeJsonWithEntityInstance() {
	return function(model: MetadataEntity, property: string) {
		Property({ mapper: MERGE_JSON_WITH_ENTITY_INSTANCE_TOKEN })(model, property);
	};
}
