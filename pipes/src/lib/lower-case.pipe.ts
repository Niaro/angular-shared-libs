import { lowerCase } from 'lodash-es';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'lowerCase'
})
export class LowerCasePipe implements PipeTransform {
	transform(value: string): string {
		return lowerCase(value);
	}
}
