import { Pipe, PipeTransform } from '@angular/core';
import { sumBy } from 'lodash-es';

@Pipe({
	name: 'sumBy'
})
export class SumByPipe implements PipeTransform {
	transform<T>(array: T[] | null, property: keyof T): number | null {
		return array && sumBy(array, <string> property);
	}
}
