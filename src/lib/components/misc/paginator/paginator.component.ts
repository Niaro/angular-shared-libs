import { Component, OnChanges, Input, ChangeDetectionStrategy, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map, filter, skip } from 'rxjs/operators';
import { isNil } from 'lodash-es';

import { PagedResults, PAGE_SIZE } from '@bp/shared/models';
import { FADE } from '@bp/shared/animations';
import { UrlHelper } from '@bp/shared/utils';

@Component({
	selector: 'bp-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [FADE]
})
export class PaginatorComponent implements OnChanges {

	@Input() pageSizeOptions = [10, 25, 50, 100, 250];
	@Input() pagedResults: PagedResults;

	@Output() page = new EventEmitter<string>();
	pageSize$ = new BehaviorSubject(PAGE_SIZE);
	get pageSize() { return this.pageSize$.value; }

	get hasNext() { return this.pagedResults && !!this.pagedResults.nextPageCursor; }
	get hasPrevious() { return !isNil(this.pageCursors[this.currentPage - 1]); }

	currentPage = 1;

	get progress() { return this.progressPrev || this.progressNext; }
	progressPrev = false;
	progressNext = false;

	pageCursors: { [page: number]: string } = { 1: '' }; // the first page doesn't have cursor

	constructor(private router: Router, private route: ActivatedRoute) {
		this.route.params
			.pipe(
				map(({ pageSize }) => +pageSize),
				filter(v => !isNaN(v) && v !== this.pageSize)
			)
			.subscribe(this.pageSize$);

		this.pageSize$
			.pipe(skip(1))
			.subscribe(v => this.navigate({ pageSize: v === PAGE_SIZE ? null : v }));
	}

	ngOnChanges({ pagedResults }: SimpleChanges) {
		if (pagedResults && this.pagedResults) {
			if (this.pagedResults.firstPage)
				this.currentPage = 1;
			this.pageCursors[this.currentPage + 1] = this.pagedResults.nextPageCursor;
			this.progressPrev = this.progressNext = false;
		}
	}

	private navigate(params: Params) {
		this.router.navigate([UrlHelper.mergeRouteParams(this.route, params)], { relativeTo: this.route });
	}
}
