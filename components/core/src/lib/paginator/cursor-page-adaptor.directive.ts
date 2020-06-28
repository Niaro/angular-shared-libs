import { isNil } from 'lodash-es';

import { Directive, Input, OnChanges, Self, SimpleChanges } from '@angular/core';

import { PagedResults } from '@bp/shared/models/common';

import { PaginatorComponent } from './paginator.component';

@Directive({
	selector: 'bp-paginator[pagedResults]'
})
export class CursorPageAdaptorDirective implements OnChanges {

	@Input('pagedResults') pagedResults!: PagedResults | null;

	pageCursors: { [ page: number ]: string | null; } = { 1: '' }; // the first page doesn't have cursor

	constructor(@Self() private _paginator: PaginatorComponent) {
		this._paginator.hasBack = () => this._hasCursor(this._paginator.getBackPage());

		this._paginator.hasNext = () => this._hasCursor(this._paginator.getNextPage());

		this._paginator.onBack = () => {
			const backPage = this._paginator.getBackPage();
			this._paginator.page = this.pageCursors[ backPage ]!;
			this._paginator.progressBack = true;
			this._paginator.currentPage = backPage;
		};

		this._paginator.onNext = () => {
			const nextPage = this._paginator.getNextPage();
			this._paginator.page = this.pageCursors[ nextPage ]!;
			this._paginator.progressNext = true;
			this._paginator.currentPage = nextPage;
		};
	}

	ngOnChanges({ pagedResults }: SimpleChanges) {
		// tslint:disable-next-line: early-exit
		if (pagedResults && this.pagedResults) {
			if (this.pagedResults.firstPage)
				this._paginator.currentPage = 1;

			this.pageCursors[ this._paginator.getNextPage() ] = this.pagedResults.nextPageCursor;
			this._paginator.progressBack = this._paginator.progressNext = false;
			this._paginator.cdr.detectChanges();
		}
	}

	private _hasCursor(page: number) {
		return !isNil(this.pageCursors[ page ]);
	}
}
