import { ValidatorFn } from '@angular/forms';

import { MetadataEntity } from '../metadata';

export type FormBuilderValue = [any, ValidatorFn | ValidatorFn[]];

export type FormGroupConfig<T extends {}, U = FormBuilderValue> = {
	[K in keyof T]?: T[K] extends never ? never : U
};

export type FormScheme<T> = {
	[K in NonFunctionPropertyNames<T>]?: T[K] extends MetadataEntity
		? FormScheme<T[K]> | null
		: ValidatorFn | ValidatorFn[] | null
};
