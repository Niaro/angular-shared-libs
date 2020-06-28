import { isNil } from 'lodash-es';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'takePresent'
})
export class TakePresentPipe implements PipeTransform {
	transform<T>(array?: T[] | null): T[] | null {
		return array ? array.filter(v => !isNil(v)) : null;
	}
}
