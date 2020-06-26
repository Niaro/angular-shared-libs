import { isNil } from 'lodash-es';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'isPresent'
})
export class IsPresentPipe implements PipeTransform {
	transform(value: any): boolean {
		return !isNil(value);
	}
}
