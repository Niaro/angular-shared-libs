import { Pipe, PipeTransform } from '@angular/core';
import { lowerCase } from 'lodash-es';

@Pipe({
	name: 'lowerCase'
})
export class LowerCasePipe implements PipeTransform {
	transform(value: string): string {
		return lowerCase(value);
	}
}
