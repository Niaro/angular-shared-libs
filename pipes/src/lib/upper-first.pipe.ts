import { upperFirst } from 'lodash-es';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'upperFirst'
})
export class UpperFirstPipe implements PipeTransform {
	transform(value: string): string {
		return upperFirst(value);
	}
}
