import { Pipe, PipeTransform } from '@angular/core';
import { chunk } from 'lodash-es';

@Pipe({
	name: 'chunk'
})
export class ChunkPipe implements PipeTransform {
	transform<T>(array: T[] | null, size: number): T[][] {
		return array ? chunk(array, size) : [];
	}
}
