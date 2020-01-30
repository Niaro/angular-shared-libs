import { Pipe, PipeTransform } from '@angular/core';
import { sumBy } from 'lodash-es';

@Pipe({
	name: 'sumBy'
})
export class SumByPipe implements PipeTransform {
	transform(array: any[] | null, property: string): number | null {
		return array && sumBy(array, property);
	}
}
