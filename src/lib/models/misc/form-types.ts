import { ValidatorFn } from '@angular/forms';

export type FormBuilderValue = [any, ValidatorFn[]];

export type Formify<T extends Object> = {
	[K in keyof T]: T[K] extends never ? never : FormBuilderValue
};
