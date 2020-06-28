import { sumBy } from 'lodash-es';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'sumBy'
})
export class SumByPipe implements PipeTransform {
	transform<T>(array: T[] | null, property: keyof T): number | null {
		return array && sumBy(array, <string> property);
	}
}
