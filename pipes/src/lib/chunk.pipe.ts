import { Pipe, PipeTransform } from '@angular/core';
import { chunk } from 'lodash-es';

@Pipe({
	name: 'chunk'
})
export class ChunkPipe implements PipeTransform {
	transform(array: any[] | null, size: number): any[][] {
		return array ? chunk(array, size) : [];
	}
}
