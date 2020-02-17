import { PageType } from './enums';
import { MetadataEntity, Mapper, Default } from '../metadata';

export class PageParams extends MetadataEntity {

	@Mapper(PageType)
	@Default(PageType.view)
	pageType!: PageType;

	id!: string;

	formId?: string;

}
