import { map } from 'lodash-es';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'toKeyValuePairs'
})
export class ToKeyValuePairsPipe implements PipeTransform {

	transform<T extends Object>(v: T): { key: string; value: any; }[] {
		return map(v, (value, key) => ({ value, key }));
	}

}
