import { Pipe, PipeTransform } from '@angular/core';
import { take } from 'lodash-es';

@Pipe({
	name: 'take'
})
export class TakePipe implements PipeTransform {
	transform(array: any[], size: number): any[][] {
		return take(array, size);
	}
}
