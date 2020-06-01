import m from 'moment';

import { Enumeration } from '@bp/shared/models/core';

import { MetadataEntity } from './metadata-entity';

export type Api<T extends Object> = {
	[ P in keyof T ]: T[ P ] extends MetadataEntity
	? Object
	: T[ P ] extends Array<MetadataEntity>
	? Object[]
	: T[ P ] extends Enumeration
	? string | number
	: T[ P ] extends (m.Moment | null | undefined)
	? string | number | null
	: T[ P ] extends (m.Moment | undefined)
	? string | number
	: T[ P ]
};
