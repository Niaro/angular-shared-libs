import { MetadataEntity } from './metadata-entity';
import { Property } from './property-metadata.decorator';

export abstract class Entity extends MetadataEntity {
	@Property()
	id!: string | null;
}
