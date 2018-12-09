import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from 'lodash-es';

@Pipe({
	name: 'isPresent'
})
export class IsPresentPipe implements PipeTransform {
	transform(value: any): boolean {
		return !isNil(value);
	}
}
