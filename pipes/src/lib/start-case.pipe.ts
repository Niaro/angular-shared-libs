import { startCase } from 'lodash-es';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'startCase'
})
export class StartCasePipe implements PipeTransform {
	transform(value: string): string {
		return startCase(value);
	}
}
