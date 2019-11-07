import {
	Component, OnDestroy, OnChanges, AfterViewInit, ElementRef, ChangeDetectorRef,
	SimpleChanges, Input, Output, ViewChild, ViewChildren, TemplateRef, ContentChild,
	QueryList, ChangeDetectionStrategy, Renderer2, TrackByFunction
} from '@angular/core';
import { Subject, BehaviorSubject, combineLatest, fromEvent } from 'rxjs';
import { takeUntil, startWith, map, switchMap, filter, subscribeOn, flatMap, first, max, distinctUntilChanged } from 'rxjs/operators';

import { isEqual, forOwn, sum, get } from 'lodash-es';
import { Dictionary } from 'lodash';

import { FADE_IN_LIST } from '@bp/shared/animations';
import { AsyncVoidSubject, BpScheduler, measure, mutate, fromMeasure, fromResize } from '@bp/shared/rxjs';
import { Direction, Dimensions } from '@bp/shared/models';
import { $ } from '@bp/shared/utils';

import { TouchManager, TouchBuilder, ISwipeEvent } from '../touch';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export enum ArrowType {
	none = 'none',
	inner = 'inner',
	circled = 'circled'
}

@Component({
	selector: 'bp-carousel',
	styleUrls: ['./carousel.component.scss'],
	templateUrl: './carousel.component.html',
	animations: [FADE_IN_LIST],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent implements AfterViewInit, OnChanges, OnDestroy {
	@Input() itemsPerViewport: number | 'unlimited' = 1;
	@Input() looped = false;
	@Input() bullets: boolean | 'always' = false;
	@Input() arrowType = ArrowType.inner;
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

	get $host(): HTMLElement { return this.host.nativeElement; }
	get $slides() { return this.$slides$.value; }

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
			&& this.arrowType !== ArrowType.none
			&& !(prevDisabled && nextDisabled))
	);

	animate$ = new BehaviorSubject(false);
	viewportHeight$ = new BehaviorSubject<number | null>(null);
	currentItemsPerView$ = new BehaviorSubject<number | 'unlimited'>(this.itemsPerViewport);
	get currentItemsPerView() { return this.currentItemsPerView$.value; }

	@ContentChild(TemplateRef, { static: false }) template!: TemplateRef<any>;
	@ViewChild('slidesContainer', { static: true }) private slidesContainerRef!: ElementRef;
	@ViewChildren('slide') private slidesQuery!: QueryList<ElementRef>;

	private get $slidesContainer(): HTMLElement { return this.slidesContainerRef && this.slidesContainerRef.nativeElement; }

	private $slides$ = new BehaviorSubject<HTMLElement[]>([]);
	private shouldUpdateScroll = false;
	private slideMaxWidth$ = new BehaviorSubject<number | null>(null);
	public get slideMaxWidth() { return this.slideMaxWidth$.value; }
	private slideStyle$ = new Subject<Dictionary<string>>();
	private touch: TouchManager;
	private autoplayTask!: number;
	private destroyed$ = new AsyncVoidSubject();

	constructor(
		private host: ElementRef,
		private cdr: ChangeDetectorRef,
		private touchBuilder: TouchBuilder,
		private renderer: Renderer2
	) {
		this.touch = this.touchBuilder.build(this.$host) as TouchManager;
		this.touch.swipe$
			.pipe(takeUntil(this.destroyed$))
			.subscribe(e => this.onSwipe(e));
	}

	ngOnChanges({ items, activeItem, itemsPerViewport }: SimpleChanges) {
		if (items && (items.firstChange || this.resetActiveOnItemsChange))
			this.activateItem(this.items[0], false);

		queueMicrotask(() => {
				if (itemsPerViewport || ((items.previousValue && items.previousValue.length) !== (items.currentValue && items.currentValue.length)))
					this.updateItemsPerView();
				if (items && !items.firstChange)
					this.updateScroll({ animate: false, distinctVisibility: false });
				else if (activeItem && !activeItem.firstChange)
					this.updateScroll({ animate: false });
			});
	}

	ngAfterViewInit() {
		this.slidesQuery.changes
			.pipe(
				startWith<QueryList<ElementRef>>(this.slidesQuery),
				map(q => q.toArray().map(ref => ref.nativeElement))
			)
			.subscribe(this.$slides$);

		this.$slides$
			.pipe(switchMap($slides => fromResize(...$slides)))
			.subscribe(() => this.shouldUpdateScroll && this.updateScroll());

		combineLatest(
			this.$slides$,
			this.slideStyle$
		)
			.pipe(mutate(([$slides, style]) => $slides
				.forEach($slide => forOwn(style, (v, k) => this.renderer.setStyle($slide, k, v))))
			)
			.subscribe();

		fromEvent(window, 'resize')
			.pipe(
				takeUntil(this.destroyed$),
				subscribeOn(BpScheduler.outside)
			)
			.subscribe(() => this.onResize());

		this.updateItemsPerView();

		setTimeout(() => {
			this.updateItemsPerView(); // required second time because slides container width is not determined in modal
			this.updateScroll();
		}, 100); // 100ms required for modal

		this.startAutoplay();
		this.cdr.detectChanges();
	}

	ngOnDestroy() {
		this.autoplayTask && this.stopAutoplay();
		this.touch.destroy();
		this.destroyed$.complete();
	}

	trackBy: TrackByFunction<any> = (index, item) => {
		return item.id || item.key || item;
	}

	startAutoplay() {
		this.stopAutoplay();
		if (this.autoplayInterval)
			this.autoplayTask = +setInterval(() => this.activateNext(true), this.autoplayInterval);
	}

	stopAutoplay() {
		this.autoplayTask && clearInterval(this.autoplayTask);
	}

	activateItem(item: any, animate = true) {
		if (item === this.activeItem) return;

		this.activeItem = item;
		this.shouldUpdateScroll && this.updateScroll({ animate });
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

	private updateScroll({ animate = false, distinctVisibility = true } = {}) {
		if (!this.slidesQuery) return;

		if (!animate) {
			this.animate$.next(false);
			setTimeout(() => this.animate$.next(true), 50);
		}

		this.slideMaxWidth$
			.pipe(
				switchMap(slideMaxWidth => fromMeasure(() => slideMaxWidth
					&& this.items.length
					&& this.items.length === this.$slides$.value.length
					&& this.activeIndex > -1
					? [
						slideMaxWidth,
						this.$slides$.value.map($slide => new Dimensions({
							left: $slide.offsetLeft,
							width: Math.floor($slide.getBoundingClientRect().width)
						}))
					]
					: null
				)),
				filter(v => !!v),
				map(v => v as [number, Dimensions[]])
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

				this.renderer.setStyle(this.$slidesContainer, 'transform', `translateX(${-offset}px)`);

				if (!distinctVisibility || !isEqual(visibilityIndexes, this.slidesVisibility$.value)) {
					this.slidesVisibility$.next(visibilityIndexes);
					this.scroll$.next(visibilityIndexes);
					this.shouldUpdateScroll = true;
				}

				this.autoheight && this.setViewportHeightByCurrentView();

				this.cdr.detectChanges();
			});
	}

	private updateItemsPerView() {
		fromMeasure(() => {
			this.currentItemsPerView$.next(window.innerWidth <= this.mobileWidth ? 1 : this.itemsPerViewport);
			return this.$slidesContainer.offsetWidth ? this.$slidesContainer.offsetWidth : null;
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
						'-ms-flex': flex, '-webkit-flex': flex, flex,
						width: `${Math.trunc(100 / this.currentItemsPerView)}%`
					};
				}

				if (slideMaxWidth)
					css['max-width'] = `${slideMaxWidth}px`;

				this.slideStyle$.next(css);
				this.slideMaxWidth$.next(slideMaxWidth);
			});
	}

	private onResize() {
		this.updateItemsPerView();
		this.updateScroll({ animate: false });
	}

	private onSwipe(e: ISwipeEvent) {
		switch (e.bpDirection) {
			case Direction.right:
				this.activatePrev();
				break;
			case Direction.left:
				this.activateNext();
				break;
		}
	}

	private setViewportHeightByCurrentView() {
		this.$slides$
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
				this.cdr.detectChanges();
			});
	}
}

interface ICarouselViewportItemsVisibility {
	firstFullyVisible?: number;
	lastFullyVisible?: number;
	firstPartiallyVisible?: number;
	lastPartiallyVisible?: number;
}
