import {
	Component, OnDestroy, OnChanges, AfterViewInit, ElementRef, ChangeDetectorRef,
	SimpleChanges, Input, Output, ViewChild, ViewChildren, TemplateRef, ContentChild,
	QueryList, ChangeDetectionStrategy, Renderer2, TrackByFunction
} from '@angular/core';
import { Subject, BehaviorSubject, combineLatest, fromEvent } from 'rxjs';
import { startWith, map, switchMap, filter, subscribeOn, flatMap, first, max, distinctUntilChanged } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { isEqual, forOwn, sum, get } from 'lodash-es';

import { FADE_IN_LIST } from '@bp/shared/animations';
import { BpScheduler, measure, mutate, fromMeasure, fromResize } from '@bp/shared/rxjs';
import { $, lineMicrotask } from '@bp/shared/utils';
import { Direction, Dimensions } from '@bp/shared/models';
import { Destroyable } from '@bp/shared/components/destroyable';

import { TouchManager, TouchBuilder, ISwipeEvent } from '../touch';

export enum CarouselArrowType {
	None = 'none',
	Inner = 'inner',
	Circled = 'circled'
}

@Component({
	selector: 'bp-carousel',
	styleUrls: ['./carousel.component.scss'],
	templateUrl: './carousel.component.html',
	animations: [FADE_IN_LIST],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent
	extends Destroyable
	implements AfterViewInit, OnChanges, OnDestroy {

	// tslint:disable-next-line: naming-convention
	CarouselArrowType = CarouselArrowType;

	@Input() itemsPerViewport: number | 'unlimited' = 1;

	@Input() looped = false;

	@Input() bullets: boolean | 'always' = false;

	@Input() arrowType = CarouselArrowType.Inner;

	@Input() arrowSize: 'sm' | 'md' = 'md';

	@Input() mobileWidth = 414;

	@Input() responsive = true;

	@Input() autoheight = false;

	@Input() showArrows = true;

	@Input() resetActiveOnItemsChange = true;

	@Input('autoplay') autoplayInterval = 0;

	@Input() slideClass?: string;

	@Input() sortable = false;

	@Input() sortableItem?: (item: any) => boolean;

	@Input() slideInAnimation = true;

	@Output('sort') readonly sort$ = new Subject<any[]>();

	@Input()
	get items() { return this.items$.value; }
	set items(value) { this.items$.next(value || []); }

	@Input()
	get activeItem() {
		if (!this.items.length) return;
		return get(this.items, this.activeIndex);
	}
	set activeItem(value: any) {
		if (value && !this.items.includes(value))
			throw new Error('The item does not belong to the carousel items');
		this._activeIndex = this.items.indexOf(value);
	}

	@Output('activeItemChange') readonly activeItemChange$ = new Subject<any>();

	@Output('scrolled') readonly scroll$ = new Subject<Readonly<ICarouselViewportItemsVisibility>>();

	private _activeIndex = -1;
	get activeIndex() {
		if (!this.items.length) return -1;
		return Math.min(this._activeIndex, this.items.length - 1);
	}

	get $host(): HTMLElement { return this._host.nativeElement; }

	get $slides() { return this._$slides$.value; }

	get isShowBullets() {
		return this.bullets === 'always' || this.bullets && this.items.length > 1;
	}

	slidesVisibility$ = new BehaviorSubject<Readonly<ICarouselViewportItemsVisibility>>({});
	get slidesVisibility() { return this.slidesVisibility$.value; }

	items$ = new BehaviorSubject<any[]>([]);

	prevButtonDisabled$ = this.slidesVisibility$.pipe(
		map(({ firstFullyVisible }) => (firstFullyVisible === undefined || firstFullyVisible === 0) && !this.looped),
		distinctUntilChanged()
	);

	nextButtonDisabled$ = combineLatest(
		this.slidesVisibility$,
		this.items$
	).pipe(
		map(([{ lastFullyVisible }, items]) =>
			(lastFullyVisible === undefined || lastFullyVisible === (items && items.length - 1)) && !this.looped
		),
		distinctUntilChanged()
	);

	showArrowButtons$ = combineLatest(
		this.prevButtonDisabled$,
		this.nextButtonDisabled$
	).pipe(
		map(([prevDisabled, nextDisabled]) => this.arrowType
			&& this.showArrows
			&& this.arrowType !== CarouselArrowType.None
			&& !(prevDisabled && nextDisabled))
	);

	animate$ = new BehaviorSubject(false);

	viewportHeight$ = new BehaviorSubject<number | null>(null);

	currentItemsPerView$ = new BehaviorSubject<number | 'unlimited'>(this.itemsPerViewport);
	get currentItemsPerView() { return this.currentItemsPerView$.value; }

	@ContentChild(TemplateRef, { static: false }) template!: TemplateRef<any>;

	@ViewChildren('slide') private _slidesQuery!: QueryList<ElementRef>;

	@ViewChild('slidesContainer', { static: true }) private _slidesContainerRef!: ElementRef;
	private get _$slidesContainer(): HTMLElement { return this._slidesContainerRef && this._slidesContainerRef.nativeElement; }

	private _slideMaxWidth$ = new BehaviorSubject<number | null>(null);
	get slideMaxWidth() { return this._slideMaxWidth$.value; }

	private _$slides$ = new BehaviorSubject<HTMLElement[]>([]);

	private _shouldUpdateScroll = false;

	private _slideStyle$ = new Subject<Dictionary<string>>();

	private _touch: TouchManager;

	private _autoplayTask!: number;

	constructor(
		private _host: ElementRef,
		private _cdr: ChangeDetectorRef,
		private _touchBuilder: TouchBuilder,
		private _renderer: Renderer2
	) {
		super();

		this._touch = <TouchManager>this._touchBuilder.build(this.$host);
		this._touch.swipe$
			.pipe(this.takeUntilDestroyed)
			.subscribe(e => this._onSwipe(e));
	}

	ngOnChanges({ items, activeItem, itemsPerViewport }: SimpleChanges) {
		if (items && (items.firstChange || this.resetActiveOnItemsChange))
			this.activateItem(this.items[0], false);

		lineMicrotask(() => {
			if (itemsPerViewport || ((items.previousValue && items.previousValue.length) !== (items.currentValue && items.currentValue.length)))
				this._updateItemsPerView();
			if (items && !items.firstChange)
				this._updateScroll({ animate: false, distinctVisibility: false });
			else if (activeItem && !activeItem.firstChange)
				this._updateScroll({ animate: false });
		});
	}

	ngAfterViewInit() {
		this._slidesQuery.changes
			.pipe(
				startWith<QueryList<ElementRef>>(this._slidesQuery),
				map(q => q.toArray().map(ref => ref.nativeElement))
			)
			.subscribe(this._$slides$);

		this._$slides$
			.pipe(switchMap($slides => fromResize(...$slides)))
			.subscribe(() => this._shouldUpdateScroll && this._updateScroll());

		combineLatest(
			this._$slides$,
			this._slideStyle$
		)
			.pipe(mutate(([$slides, style]) => $slides
				.forEach($slide => forOwn(style, (v, k) => this._renderer.setStyle($slide, k, v))))
			)
			.subscribe();

		fromEvent(window, 'resize')
			.pipe(
				subscribeOn(BpScheduler.outside),
				this.takeUntilDestroyed,
			)
			.subscribe(() => this._onResize());

		this._updateItemsPerView();

		setTimeout(() => {
			this._updateItemsPerView(); // required second time because slides container width is not determined in modal
			this._updateScroll();
		}, 100); // 100ms required for modal

		this.startAutoplay();
		this._cdr.detectChanges();
	}

	ngOnDestroy() {
		super.ngOnDestroy();

		this._autoplayTask && this.stopAutoplay();
		this._touch.destroy();
	}

	trackBy: TrackByFunction<any> = (index, item) => item.id || item.key || item;

	startAutoplay() {
		this.stopAutoplay();
		if (this.autoplayInterval)
			this._autoplayTask = +setInterval(() => this.activateNext(true), this.autoplayInterval);
	}

	stopAutoplay() {
		this._autoplayTask && clearInterval(this._autoplayTask);
	}

	activateItem(item: any, animate = true) {
		if (item === this.activeItem) return;

		this.activeItem = item;
		this._shouldUpdateScroll && this._updateScroll({ animate });
		this.activeItemChange$.next(this.activeItem);
	}

	activateIndex(index: number) {
		const item = index >= 0 ? this.items[index] : undefined;
		this.activateItem(item);
	}

	activateNext(forceLooped?: boolean) {
		if (this.slidesVisibility.lastFullyVisible !== this.items.length - 1)
			this.activateIndex(this.activeIndex + 1);
		else if (this.looped || forceLooped)
			this.activateIndex(0);
	}

	activatePrev(forceLooped?: boolean) {
		if (this.slidesVisibility.firstFullyVisible! > 0)
			this.activateIndex(this.slidesVisibility.firstFullyVisible! - 1);
		else if (this.looped || forceLooped)
			this.activateIndex(this.items.length - 1);
	}

	drop({ previousIndex, currentIndex }: CdkDragDrop<any[]>) {
		if (previousIndex === currentIndex)
			return;

		if (this.sortableItem && !this.sortableItem(this.items[currentIndex]))
			currentIndex = previousIndex;

		const copy = this.items.slice();
		moveItemInArray(copy, previousIndex, currentIndex);
		this.items = copy;

		if (previousIndex === currentIndex)
			return;

		this.sort$.next(this.items);
	}

	private _updateScroll({ animate = false, distinctVisibility = true } = {}) {
		if (!this._slidesQuery) return;

		if (!animate) {
			this.animate$.next(false);
			setTimeout(() => this.animate$.next(true), 50);
		}

		this._slideMaxWidth$
			.pipe(
				switchMap(slideMaxWidth => fromMeasure(() => slideMaxWidth
					&& this.items.length
					&& this.items.length === this._$slides$.value.length
					&& this.activeIndex > -1
					? [
						slideMaxWidth,
						this._$slides$.value.map($slide => new Dimensions({
							left: $slide.offsetLeft,
							width: Math.floor($slide.getBoundingClientRect().width)
						}))
					]
					: null
				)),
				filter(v => !!v),
				map(v => <[number, Dimensions[]]>v)
			)
			.subscribe(([slideMaxWidth, offsets]) => {
				let maxOffset: number;
				if (this.currentItemsPerView === 'unlimited')
					maxOffset = sum(offsets.map(({ width }) => width)) - slideMaxWidth;
				else
					maxOffset = slideMaxWidth / this.currentItemsPerView * this.items.length - slideMaxWidth;
				if (maxOffset < 0)
					maxOffset = 0;
				const slideOffset = offsets[this.activeIndex];
				const offset = Math.min(slideOffset.left, maxOffset);

				// calculate visibility indexes
				const offsetLeft = Math.ceil(offset); // required because slide offset is always integer
				const offsetRight = offsetLeft + slideMaxWidth;
				const lastIndex = this.items.length - 1;

				const visibilityIndexes: ICarouselViewportItemsVisibility = {};

				let i = this.activeIndex - 1;
				while (i >= 0 && offsetLeft <= offsets[i].left)
					i--;
				visibilityIndexes.firstFullyVisible = i + 1;

				i = this.activeIndex + 1;
				while (i <= lastIndex && offsets[i].right <= offsetRight)
					i++;
				visibilityIndexes.lastFullyVisible = i - 1;

				i = this.activeIndex - 1;
				while (i >= 0 && offsetLeft < offsets[i].right)
					i--;
				visibilityIndexes.firstPartiallyVisible = i + 1;

				i = this.activeIndex + 1;
				while (i <= lastIndex && offsets[i].left < offsetRight)
					i++;
				visibilityIndexes.lastPartiallyVisible = i - 1;

				this._renderer.setStyle(this._$slidesContainer, 'transform', `translateX(${-offset}px)`);

				if (!distinctVisibility || !isEqual(visibilityIndexes, this.slidesVisibility$.value)) {
					this.slidesVisibility$.next(visibilityIndexes);
					this.scroll$.next(visibilityIndexes);
					this._shouldUpdateScroll = true;
				}

				this.autoheight && this._setViewportHeightByCurrentView();

				this._cdr.detectChanges();
			});
	}

	private _updateItemsPerView() {
		fromMeasure(() => {
			this.currentItemsPerView$.next(window.innerWidth <= this.mobileWidth ? 1 : this.itemsPerViewport);
			return this._$slidesContainer.offsetWidth ? this._$slidesContainer.offsetWidth : null;
		})
			.subscribe((slideMaxWidth) => {
				let css: Dictionary<any>;
				if (this.currentItemsPerView === 'unlimited')
				css = {
					'-ms-flex': null, '-webkit-flex': null, flex: null,
					'-ms-flex-shrink': 0, '-webkit-flex-shrink': 0, 'flex-shrink': 0,
					width: 'initial'
				};
				else {
					// use width instead of flex-basis because IE 11 doesn't respect padding on flex-item
					// @link https://github.com/philipwalton/flexbugs#7-flex-basis-doesnt-account-for-box-sizingborder-box
					const flex = '0 0 auto';
					css = {
						flex,
						'-ms-flex': flex,
						'-webkit-flex': flex,
						width: `${Math.trunc(100 / this.currentItemsPerView)}%`
					};
				}

				if (slideMaxWidth)
				css['max-width'] = `${slideMaxWidth}px`;

					this._slideStyle$.next(css);
					this._slideMaxWidth$.next(slideMaxWidth);
				});
			}

	private _onResize() {
		this._updateItemsPerView();
		this._updateScroll({ animate: false });
	}

	private _onSwipe(e: ISwipeEvent) {
		switch (e.bpDirection) {
			case Direction.Right:
				this.activatePrev();
				break;
			case Direction.Left:
				this.activateNext();
				break;
		}
	}

	private _setViewportHeightByCurrentView() {
		this._$slides$
			.pipe(
				first(),
				flatMap(slides => slides),
				filter((item, index) =>
					this.slidesVisibility.firstPartiallyVisible! <= index
					&& index <= this.slidesVisibility.lastPartiallyVisible!
				),
				measure($slide => $.outerSize($slide).height),
				max(),
			)
			.subscribe(height => {
				this.viewportHeight$.next(height);
				this._cdr.detectChanges();
			});
	}
}

interface ICarouselViewportItemsVisibility {
	firstFullyVisible?: number;
	lastFullyVisible?: number;
	firstPartiallyVisible?: number;
	lastPartiallyVisible?: number;
}
