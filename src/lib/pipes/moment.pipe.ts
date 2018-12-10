import { Pipe, PipeTransform } from '@angular/core';
import * as m from 'moment';

@Pipe({
	name: 'moment'
})
export class MomentPipe implements PipeTransform {
	transform(unix: number, format: string): string {
		return m.unix(unix).format(format);
	}
}
