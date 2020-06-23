import { Pipe, PipeTransform } from '@angular/core';
import m from 'moment';

@Pipe({
	name: 'momentFormat'
})
export class MomentPipe implements PipeTransform {
	transform(unixOrMoment: number | m.Moment, format: string): string {
		return (m.isMoment(unixOrMoment) ? unixOrMoment : m.unix(unixOrMoment)).format(format);
	}
}
