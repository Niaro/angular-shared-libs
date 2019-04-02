import { assignWith, isNil, isArray, has, camelCase, forIn } from 'lodash-es';

import { isExtensionOf } from '@bp/shared/utils';

import { PropertiesMetadata } from './properties-metadata';
import { NonFunctionPropertyNames, Enumeration } from '../misc';

export abstract class MetadataEntity {
	static get metadata(): PropertiesMetadata {
		if (has(this, '_metadata'))
			return this._metadata;
		return this._metadata = new PropertiesMetadata();
	}
	private static _metadata = new PropertiesMetadata();

	static getMetaPropertyNames<T>(): NonFunctionPropertyNames<T>[] {
		return this.metadata.list.map(it => it.property) as any;
	}

	static getLabel<T>(prop: NonFunctionPropertyNames<T>) {
		const meta = this.metadata.get(prop);

		if (!meta)
			throw new Error(`Metadata for the property ${prop} hasn't been found`);

		return meta.label;
	}

	constructor(data?: Partial<MetadataEntity>) {
		assignWith(this, data, this.assignCustomizer);
		this.setDefaults();
	}

	get meta() {
		return (<typeof MetadataEntity>this.constructor).metadata;
	}

	getLabel<T = this>(propName: NonFunctionPropertyNames<T>) {
		const meta = this.meta.get(propName);

		if (!meta)
			throw new Error(`There is no metadata for the property ${propName}`);

		return meta.label;
	}

	protected assignCustomizer = (currValue: any, srcValue: any, key: string, currObject, srcObject) => {
		const mapper = (<typeof MetadataEntity>this.constructor).metadata.mappers[key];

		if (!isNil(srcValue) && mapper) {
			const make = v => isExtensionOf(mapper, Enumeration)
				? (<typeof Enumeration>mapper).parse(camelCase(v))
				// if the mapper doesn't have a name we assume that this is a class is used as a mapper so we initiate it
				: isExtensionOf(mapper, MetadataEntity) ? new mapper(v) : mapper(v, srcObject, currObject);

			return isArray(srcValue)
				? srcValue.map(v => make(v))
				: make(srcValue);
		}

		return srcValue;
	}

	private setDefaults() {
		forIn((<typeof MetadataEntity>this.constructor).metadata.defaults, (defaultValue, k) => {
			if (this[k] === undefined)
				this[k] = defaultValue;
		});
	}
}
