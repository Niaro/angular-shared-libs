import { ValidatorFn } from '@angular/forms';

import { NonFunctionPropertyNames } from '@bp/shared/typings';

import { MetadataEntity } from './metadata-entity';

export type FormScheme<T> = {
	[ K in NonFunctionPropertyNames<T> ]?: T[ K ] extends MetadataEntity
	? FormScheme<T[ K ]> | null
	: ValidatorFn | ValidatorFn[] | null
};
