import { Directive, TemplateRef, ViewContainerRef, Input, ElementRef, AfterViewChecked } from '@angular/core';
import { timer, Observable } from 'rxjs';
import { first, flatMap, map, shareReplay } from 'rxjs/operators';

import { lineMicrotask } from '@bp/shared/utils';

import { OptionalBehaviorSubject, fromMutation } from '../rxjs';
import { Destroyable } from '../components/destroyable';

/**
 * Rendering a significant amount of complex components in one event loop can create a visible freezes of the UI
 * so this directive batches waiting for rendering components between event loops, so each one of them will contain
 * a manageable amount of work
 */
@Directive({ selector: '[bpDelayedRender]' })
export class DelayedRenderDirective extends Destroyable implements AfterViewChecked {


	private static readonly _isAttachedToDomStreamMapByHTMLElement = new WeakMap<HTMLElement, Observable<boolean>>();

	private static readonly _bodyMutations$ = fromMutation(document.body, { subtree: true, childList: true })
		.pipe(shareReplay({ refCount: false, bufferSize: 1 }));

	private static readonly _maxInstantRenderedViews = 7;

	private static _instantViewsRenderingCounter = 0;


	@Input('bpDelayedRender') id!: string;

	private _parentElement$ = new OptionalBehaviorSubject<HTMLElement | null>();

	// tslint:disable-next-line: member-ordering
	constructor(
		private _host: ElementRef,
		private _viewContainer: ViewContainerRef,
		private _tplRef: TemplateRef<any>
	) {
		super();

		this._whenParentElementAppears$()
			.pipe(flatMap(v => this._waitTillAttachedToDom$(v)))
			.subscribe(() => this._scheduleCmptRendering());
	}

	ngAfterViewChecked() {
		if (!this._parentElement$.value)
			this._parentElement$.next((<Comment> this._host.nativeElement).parentElement);
	}

	private _whenParentElementAppears$() {
		return <Observable<HTMLElement>> this._parentElement$
			.pipe(first(v => !!v));
	}

	private _waitTillAttachedToDom$($el: HTMLElement) {
		if (DelayedRenderDirective._isAttachedToDomStreamMapByHTMLElement.has($el))
			return DelayedRenderDirective._isAttachedToDomStreamMapByHTMLElement.get($el)!;

		const attached$ = DelayedRenderDirective._bodyMutations$.pipe(
			map(() => $el.isConnected),
			first(v => !!v),
		);

		DelayedRenderDirective._isAttachedToDomStreamMapByHTMLElement.set($el, attached$);

		return attached$;
	}

	private _scheduleCmptRendering() {
		if (DelayedRenderDirective._instantViewsRenderingCounter <= DelayedRenderDirective._maxInstantRenderedViews)
			this._renderCmpt(); // to render in the current event loop a set number of views
		else
			timer((DelayedRenderDirective._instantViewsRenderingCounter - DelayedRenderDirective._maxInstantRenderedViews) * 2)
				.pipe(this.takeUntilDestroyed)
				.subscribe(() => this._renderCmpt());

		DelayedRenderDirective._instantViewsRenderingCounter++;

		lineMicrotask(() => DelayedRenderDirective._instantViewsRenderingCounter = 0);
	}

	private _renderCmpt() {
		this._viewContainer.createEmbeddedView(this._tplRef).detectChanges();
	}
}
