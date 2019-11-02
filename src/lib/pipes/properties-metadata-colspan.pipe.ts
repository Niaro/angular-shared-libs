import { Pipe, PipeTransform } from '@angular/core';
import { PropertyMetadata } from '../models';

@Pipe({
	name: 'colspan'
})
export class PropertiesMetadataColspanPipe implements PipeTransform {
	transform(array: PropertyMetadata[], index: number, additionalSpan: number = 0): number | null {
		let counter = 1 + additionalSpan; // 1 is the spanning cell
		index--;

		while (array[index] && array[index].table!.headless) {
			counter++;
			index--;
		}

		return counter === 1 ? null : counter;
	}
}
