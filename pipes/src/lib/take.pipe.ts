import { take } from 'lodash-es';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'take'
})
export class TakePipe implements PipeTransform {
	transform<T>(array: T[] | null, size: number): T[] | null {
		return array ? take(array, size) : null;
	}
}
