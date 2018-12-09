import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'lodash-es';

@Pipe({
	name: 'toKeyValuePairs'
})
export class ToKeyValuePairsPipe implements PipeTransform {

	transform(v: {}): { key: string, value: any }[] {
		return map(v, (value, key) => ({ value, key }));
	}

}
