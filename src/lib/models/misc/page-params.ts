import { PageType } from './enums';
import { MetadataEntity, Mapper } from '../metadata';

export class PageParams extends MetadataEntity {
	@Mapper(PageType)
	type!: PageType | null;
	id!: string;
}
