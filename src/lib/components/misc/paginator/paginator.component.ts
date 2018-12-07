import { Component, OnChanges, Input, Output, EventEmitter, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { isNil } from 'lodash-es';

import { PagedResults } from '@bp/shared/models';
import { FADE } from '@bp/shared/animations';

@Component({
	selector: 'bp-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [FADE]
})
export class PaginatorComponent implements OnChanges {
	@Input() pageSize: number;
	@Output() pageSizeChange = new EventEmitter<number>();
	@Input() pageSizeOptions = [10, 25, 50, 100, 250];
	@Input() pagedResults: PagedResults;

	@Output() page = new EventEmitter<string>();

	get hasNext() { return this.pagedResults && !!this.pagedResults.nextPageCursor; }
	get hasPrevious() { return !isNil(this.pageCursors[this.currentPage - 1]); }

	currentPage = 1;

	get progress() { return this.progressPrev || this.progressNext; }
	progressPrev = false;
	progressNext = false;

	pageCursors: { [page: number]: string } = { 1: '' }; // the first page doesn't have cursor

	ngOnChanges({ pagedResults }: SimpleChanges) {
		if (pagedResults && this.pagedResults) {
			if (this.pagedResults.firstPage)
				this.currentPage = 1;
			this.pageCursors[this.currentPage + 1] = this.pagedResults.nextPageCursor;
			this.progressPrev = this.progressNext = false;
		}
	}
}
