import { ValidatorFn } from '@angular/forms';

export type FormBuilderValue = [any, ValidatorFn | ValidatorFn[]];

export type FormGroupConfig<T extends {}, U = FormBuilderValue> = {
	[K in keyof T]?: T[K] extends never ? never : U
};
