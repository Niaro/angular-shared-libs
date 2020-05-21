import { Pipe, PipeTransform } from '@angular/core';
import { take } from 'lodash-es';

@Pipe({
	name: 'take'
})
export class TakePipe implements PipeTransform {
	transform(array: any[] | undefined | null, size: number): any[][] | undefined | null {
		return array && take(array, size);
	}
}
