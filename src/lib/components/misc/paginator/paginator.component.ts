import { Component, Input, ChangeDetectionStrategy, Output, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, filter, skip } from 'rxjs/operators';

import { PAGE_SIZE } from '@bp/shared/models';
import { FADE } from '@bp/shared/animations';
import { UrlHelper } from '@bp/shared/utils';
import { OptionalBehaviorSubject } from '@bp/shared/rxjs';


@Component({
	selector: 'bp-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [FADE]
})
export class PaginatorComponent {
	Math = Math;

	@Input() pageSizeOptions = [10, 25, 50, 100, 250];

	@Input() totalLength!: number;

	@Input() pageLength!: number;

	@Output('page') readonly page$ = new OptionalBehaviorSubject<string | undefined>();
	get page() { return this.page$.value; }
	set page(value: string | undefined) { this.page$.next(value); }

	readonly pageSize$ = new BehaviorSubject(PAGE_SIZE);
	get pageSize() { return this.pageSize$.value; }

	get offset() { return (this.currentPage - 1) * this.pageSize; }

	readonly currentPage$ = new BehaviorSubject(1);
	get currentPage() { return this.currentPage$.value; }
	set currentPage(value: number) { this.currentPage$.next(value); }

	readonly progressBack$ = new BehaviorSubject(false);
	get progressBack() { return this.progressBack$.value; }
	set progressBack(value: boolean) { this.progressBack$.next(value); }

	readonly progressNext$ = new BehaviorSubject(false);
	get progressNext() { return this.progressNext$.value; }
	set progressNext(value: boolean) { this.progressNext$.next(value); }

	readonly progress$ = combineLatest(this.progressBack$, this.progressNext$)
		.pipe(map(([back, next]) => back || next));

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		public cdr: ChangeDetectorRef
	) {
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

	getBackPage() {
		return this.currentPage - 1;
	}

	getNextPage() {
		return this.currentPage + 1;
	}

	onBack = () => {
		this.page = this.getBackPage().toString();
		this.currentPage = this.getBackPage();
	}

	onNext = () => {
		this.page = this.getNextPage().toString();
		this.currentPage = this.getNextPage();
	}

	hasBack = () => this.offset >= this.pageSize;

	hasNext = () => this.offset < this.totalLength;

	private navigate(params: Params) {
		this.router.navigate([UrlHelper.mergeRouteParams(this.route, params)], { relativeTo: this.route });
	}
}
