import { assignWith, isNil, isArray, has, camelCase, mapValues } from 'lodash-es';
import * as m from 'moment';

import { isExtensionOf } from '@bp/shared/utils';

import { ClassMetadata } from './class-metadata';
import { Enumeration } from '../misc/enums/enum';

export abstract class MetadataEntity {

	private static _metadata: ClassMetadata;

	static get metadata(): ClassMetadata {
		if (has(this, '_metadata'))
			return this._metadata;

		return this._metadata = new ClassMetadata(this);
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
		const meta = this.metadata.get(<string>prop);
		return meta && meta.label;
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
		const meta = this.getMetadata().get(<string>propName);
		return meta && meta.label;
	}

	protected assignCustomizer(
		currValue: any,
		srcValue: any,
		key: string | undefined,
		currObject: {} | undefined,
		srcObject: {} | undefined
	) {
		if (key && this.getMetadata().has(key)) {
			const { mapper } = this.getMetadata().get(key)!;

			if (!isNil(srcValue) && mapper) {
				const isEnumMapper = isExtensionOf(mapper, Enumeration);
				const isMetadataEntityMapper = isExtensionOf(mapper, MetadataEntity);
				const isFunctionMapper = !isEnumMapper && !isMetadataEntityMapper;

				const make = (v: string | undefined) => isEnumMapper
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
			.filter(v => v.default !== undefined && isNil((<any>this)[v.property]))
			.forEach(v => (<any>this)[v.property] = v.default);
	}

	toJSON(): any {
		return JSON.parse(JSON.stringify(mapValues(this, v => m.isMoment(v) ? v.unix() : v)));
	}
}
