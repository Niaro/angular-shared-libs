import { assignWith, isNil, isArray, has, camelCase } from 'lodash-es';

import { isExtensionOf } from '@bp/shared/utils';

import { PropertiesMetadata } from './properties-metadata';
import { NonFunctionPropertyNames, Enumeration } from '../misc';

export abstract class MetadataEntity {

	private static _metadata: PropertiesMetadata;

	static get metadata(): PropertiesMetadata {
		if (has(this, '_metadata'))
			return this._metadata;

		return this._metadata = new PropertiesMetadata(this);
	}

	static getMetadata(model: MetadataEntity) {
		if (!(model instanceof MetadataEntity))
			throw new Error('The decorator can be set only for the class which extends the MetadataEntity class');

		return (<typeof MetadataEntity>model.constructor).metadata;
	}

	static getMetaPropertyNames<T>(): NonFunctionPropertyNames<T>[] {
		return this.metadata.keys() as any;
	}

	static getLabel<T>(prop: NonFunctionPropertyNames<T>) {
		return this.metadata.get(<string>prop).label;
	}

	constructor(data?: Partial<MetadataEntity>) {
		assignWith(this, data, this.assignCustomizer);
		this.setDefaults();
	}

	get meta() {
		return MetadataEntity.getMetadata(this);
	}

	getLabel<T = this>(propName: NonFunctionPropertyNames<T>) {
		return this.meta.get(<string>propName).label;
	}

	protected assignCustomizer = (currValue: any, srcValue: any, key: string, currObject, srcObject) => {
		if (this.meta.has(key)) {
			const { mapper } = this.meta.get(key);

			if (!isNil(srcValue) && mapper) {
				const isEnumMapper = isExtensionOf(mapper, Enumeration);
				const isMetadataEntityMapper = isExtensionOf(mapper, MetadataEntity);
				const isFunctionMapper = !isEnumMapper && !isMetadataEntityMapper;

				const make = v => isEnumMapper
					? (<typeof Enumeration>mapper).parse(camelCase(v))
					// if the mapper doesn't have a name we assume that this is a class is used as a mapper so we initiate it
					: new mapper(v);

				return isFunctionMapper
					? mapper(srcValue, srcObject, currObject)
					: isArray(srcValue)
						? srcValue.map(v => make(v))
						: make(srcValue);
			}
		}

		return srcValue;
	}

	private setDefaults() {
		this.meta
			.values()
			.filter(v => isNil(this[v.property]))
			.forEach(v => this[v.property] = v.default);
	}
}
