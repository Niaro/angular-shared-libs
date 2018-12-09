import { Pipe, PipeTransform } from '@angular/core';
import { upperFirst } from 'lodash-es';

@Pipe({
	name: 'upperFirst'
})
export class UpperFirstPipe implements PipeTransform {
	transform(value: string): string {
		return upperFirst(value);
	}
}
