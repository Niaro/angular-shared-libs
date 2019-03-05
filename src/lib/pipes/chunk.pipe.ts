import { Pipe, PipeTransform } from '@angular/core';
import { chunk } from 'lodash-es';

@Pipe({
	name: 'chunk'
})
export class ChunkPipe implements PipeTransform {
	transform(array: any[], size: number): any[][] {
		return chunk(array, size);
	}
}
