import { Directive, Input, SimpleChanges, Self, OnChanges } from '@angular/core';

import { PagedResults } from '@bp/shared/models';

import { PaginatorComponent } from './paginator.component';
import { isNil } from 'lodash-es';


@Directive({
	selector: 'bp-paginator[pagedResults]'
})
export class CursorPageAdaptorDirective implements OnChanges {
	@Input('pagedResults') pagedResults!: PagedResults;

	pageCursors: { [page: number]: string | null } = { 1: '' }; // the first page doesn't have cursor

	constructor(@Self() private paginator: PaginatorComponent) {
		this.paginator.hasBack = () => this.hasCursor(this.paginator.getBackPage());

		this.paginator.hasNext = () => this.hasCursor(this.paginator.getNextPage());

		this.paginator.onBack = () => {
			const backPage = this.paginator.getBackPage();
			this.paginator.page = this.pageCursors[backPage]!;
			this.paginator.progressBack = true;
			this.paginator.currentPage = backPage;
		};

		this.paginator.onNext = () => {
			const nextPage = this.paginator.getNextPage();
			this.paginator.page = this.pageCursors[nextPage]!;
			this.paginator.progressNext = true;
			this.paginator.currentPage = nextPage;
		};
	}

	ngOnChanges({ pagedResults }: SimpleChanges) {
		if (pagedResults && this.pagedResults) {
			if (this.pagedResults.firstPage)
				this.paginator.currentPage = 1;

			this.pageCursors[this.paginator.getNextPage()] = this.pagedResults.nextPageCursor!;
			this.paginator.progressBack = this.paginator.progressNext = false;
			this.paginator.cdr.detectChanges();
		}
	}

	private hasCursor(page: number) {
		return !isNil(this.pageCursors[page]);
	}
}
