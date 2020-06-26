import { ValidatorFn } from '@angular/forms';

import { NonFunctionPropertyNames } from './typings';

export type FormBuilderValue = [ any, (ValidatorFn | ValidatorFn[])?];

export type FormGroupConfig<T extends {}, U = FormBuilderValue> = {
	[ K in NonFunctionPropertyNames<T> ]?: T[ K ] extends never ? never : U
};
