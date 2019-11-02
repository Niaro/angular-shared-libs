import { MetadataEntity } from '../metadata-entity';
import { PropertyMetadataTable } from '../property-metadata-table';

/**
 * Properties marked by this decorator will be used for constructing columns for mat-table by the TableHostComponent
 */
export function Table(config: Partial<PropertyMetadataTable> = {}) {
	return function (model: MetadataEntity, property: string) {
		const propsMd = MetadataEntity
			.getMetadata(model);

		const propMd = propsMd.get(property);
		const currentTableConfig = propMd ? propMd.table : {};

		propsMd
			.add(property, {
				table: new PropertyMetadataTable({
					...currentTableConfig,
					...config
				})
			});
	};
}
