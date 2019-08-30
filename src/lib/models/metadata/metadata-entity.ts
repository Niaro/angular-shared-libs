import { assignWith, isNil, isArray, has, camelCase } from 'lodash-es';

import { isExtensionOf } from '@bp/shared/utils';

import { PropertiesMetadata } from './properties-metadata';
import { Enumeration } from '../misc';

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

	constructor(data?: any) {
		this.applyPropertyAttributes();
		assignWith(this, data, (...args) => this.assignCustomizer(...args));
		this.setDefaults();
	}

	getMetadata() {
		return MetadataEntity.getMetadata(this);
	}

	getLabel<T = this>(propName: NonFunctionPropertyNames<T>) {
		return this.getMetadata().get(<string>propName).label;
	}

	protected assignCustomizer(currValue: any, srcValue: any, key: string, currObject, srcObject) {
		if (this.getMetadata().has(key)) {
			const { mapper } = this.getMetadata().get(key);

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

	private applyPropertyAttributes() {
		this.getMetadata()
			.values()
			.filter(v => v.unserializable)
			.forEach(v => Object.defineProperty(this, v.property, {
				enumerable: false,
				configurable: true,
				writable: true
			}));
	}

	private setDefaults() {
		this.getMetadata()
			.values()
			.filter(v => v.default !== undefined && isNil(this[v.property]))
			.forEach(v => this[v.property] = v.default);
	}
}
