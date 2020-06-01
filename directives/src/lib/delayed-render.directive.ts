import { Directive, TemplateRef, ViewContainerRef, Input, ElementRef } from '@angular/core';
import { timer } from 'rxjs';
import { first, map, startWith, share, observeOn } from 'rxjs/operators';

import { lineMicrotask } from '@bp/shared/utilities';
import { fromMutation, BpScheduler } from '@bp/shared/rxjs';
import { Destroyable } from '@bp/shared/models/common';

/**
 * Rendering a significant amount of complex components in one event loop can create a visible freezes of the UI
 * so this directive batches waiting for rendering components between event loops, so each one of them will contain
 * a manageable amount of work
 */
@Directive({ selector: '[bpDelayedRender]' })
export class DelayedRenderDirective extends Destroyable {


	private static readonly _bodyMutations$ = fromMutation(document.body, { subtree: true, childList: true })
		.pipe(share());

	private static readonly _maxInstantRenderedViews = 7;

	private static _instantViewsRenderingCounter = 0;

	@Input('bpDelayedRender') id!: string;

	private get _$host() { return <Comment> this._host.nativeElement; }

	// tslint:disable-next-line: member-ordering
	constructor(
		private _host: ElementRef,
		private _viewContainer: ViewContainerRef,
		private _tplRef: TemplateRef<any>
	) {
		super();

		this._waitTillParentElementAttachedToDom$()
			.subscribe(() => this._scheduleCmptRendering());
	}

	private _waitTillParentElementAttachedToDom$() {
		return DelayedRenderDirective._bodyMutations$.pipe(
			map(() => this._$host.parentElement?.isConnected),
			startWith(this._$host.parentElement?.isConnected),
			first(v => !!v),
			observeOn(BpScheduler.inside)
		);
	}

	private _scheduleCmptRendering() {
		if (DelayedRenderDirective._instantViewsRenderingCounter <= DelayedRenderDirective._maxInstantRenderedViews)
			this._renderCmpt(); // to render in the current event loop a set number of views
		else
			timer(this._calcNextRenderDueTime())
				.pipe(this.takeUntilDestroyed)
				.subscribe(() => this._renderCmpt());

		DelayedRenderDirective._instantViewsRenderingCounter++;

		lineMicrotask(() => DelayedRenderDirective._instantViewsRenderingCounter = 0);
	}

	private _renderCmpt() {
		this._viewContainer.createEmbeddedView(this._tplRef).detectChanges();
	}

	private _calcNextRenderDueTime() {
		return DelayedRenderDirective._instantViewsRenderingCounter - DelayedRenderDirective._maxInstantRenderedViews * 2;

		// const remainder = (DelayedRenderDirective._instantViewsRenderingCounter -
		// 	DelayedRenderDirective._maxInstantRenderedViews) % DelayedRenderDirective._maxInstantRenderedViews;

		// return DelayedRenderDirective._instantViewsRenderingCounter - remainder
		// 	/ DelayedRenderDirective._maxInstantRenderedViews;
	}
}
