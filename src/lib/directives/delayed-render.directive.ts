import { Directive, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { timer } from 'rxjs';

import { AsyncVoidSubject } from '../rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Rendering a significant amount of complex components in one event loop can create a visible freezes of the UI
 * so this directive batches waiting for rendering components between event loops, so each one of them will contain
 * a manageable amount of work
 */
@Directive({ selector: '[bpDelayedRender]' })
export class DelayedRenderDirective implements OnInit, OnDestroy {
	private static instantViewsRenderingCounter = 0;
	private static maxInstantRenderedViews = 10;

	private destroyed$ = new AsyncVoidSubject();

	constructor(
		private _viewContainer: ViewContainerRef,
		private tplRef: TemplateRef<any>
	) { }

	ngOnInit() {
		if (DelayedRenderDirective.instantViewsRenderingCounter <= DelayedRenderDirective.maxInstantRenderedViews)
			this.renderView(); // to render in the current event loop a set number of views
		else
			// if the rendered views counter exceeds the max we schedule rendering to the next event loops
			timer(0)
				.pipe(takeUntil(this.destroyed$))
				.subscribe(() => this.renderView());

		DelayedRenderDirective.instantViewsRenderingCounter++;

		timer(0)
			.subscribe(() => DelayedRenderDirective.instantViewsRenderingCounter = 0);
	}

	ngOnDestroy() {
		this.destroyed$.complete();
	}

	private renderView() {
		// console.warn(DelayedRenderDirective.instantViewsRenderingCounter);
		this._viewContainer.createEmbeddedView(this.tplRef).detectChanges();
	}
}
