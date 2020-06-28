import { isEqual, omit } from 'lodash-es';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, skip } from 'rxjs/operators';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { FADE } from '@bp/shared/animations';
import { PAGE_SIZE } from '@bp/shared/models/common';
import { OptionalBehaviorSubject } from '@bp/shared/rxjs';
import { UrlHelper } from '@bp/shared/utilities';

@Component({
	selector: 'bp-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: [ './paginator.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ FADE ]
})
export class PaginatorComponent {

	@Input() pageSizeOptions = [ 10, 24, 50, 100, 250 ];

	@Input() totalLength!: number | null;

	@Input() pageLength?: number | null;

	@Input() scrollTarget?: HTMLElement;

	@Output('page') readonly page$ = new OptionalBehaviorSubject<string | undefined>();
	get page() { return this.page$.value; }
	set page(value: string | undefined) {
		this.scrollTarget?.scrollIntoView();
		this.page$.next(value);
	}

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

	readonly progress$ = combineLatest([
		this.progressBack$,
		this.progressNext$
	])
		.pipe(map(([ back, next ]) => back || next));

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		public cdr: ChangeDetectorRef
	) {
		this._route.params
			.pipe(
				map(({ pageSize }) => +pageSize),
				filter(v => !isNaN(v) && v !== this.pageSize)
			)
			.subscribe(this.pageSize$);

		this._route.params
			.pipe(
				map(params => omit(params, 'page')),
				distinctUntilChanged(isEqual)
			)
			.subscribe(() => {
				if (this.page)
					this.page = undefined;
				this.currentPage = 1;
			});

		this.pageSize$
			.pipe(skip(1))
			.subscribe(v => this._navigate({ pageSize: v === PAGE_SIZE ? null : v }));
	}

	getBackPage() {
		return this.currentPage - 1;
	}

	getNextPage() {
		return this.currentPage + 1;
	}

	onBack = () => {
		this.page = this.getBackPage()
			.toString();
		this.currentPage = this.getBackPage();
	};

	onNext = () => {
		this.page = this.getNextPage()
			.toString();
		this.currentPage = this.getNextPage();
	};

	hasBack = () => this.offset >= this.pageSize;

	hasNext = () => this.offset + (this.pageLength || 0) < (this.totalLength || 0);

	private _navigate(params: Params) {
		this._router.navigate([ UrlHelper.mergeRouteParams(this._route, params) ], { relativeTo: this._route });
	}
}
