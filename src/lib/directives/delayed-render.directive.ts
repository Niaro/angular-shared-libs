import { Directive, TemplateRef, ViewContainerRef, OnDestroy, Input, ElementRef, AfterViewChecked } from '@angular/core';
import { timer } from 'rxjs';
import { takeUntil, filter, first } from 'rxjs/operators';

import { lineMicrotask } from '@bp/shared/utils';

import { AsyncVoidSubject, OptionalBehaviorSubject } from '../rxjs';

/**
 * Rendering a significant amount of complex components in one event loop can create a visible freezes of the UI
 * so this directive batches waiting for rendering components between event loops, so each one of them will contain
 * a manageable amount of work
 */
@Directive({ selector: '[bpDelayedRender]' })
export class DelayedRenderDirective implements OnDestroy, AfterViewChecked {

	@Input('bpDelayedRender') id!: string;

	private static instantViewsRenderingCounter = 0;

	private static maxInstantRenderedViews = 7;

	private destroyed$ = new AsyncVoidSubject();

	private parentElement$ = new OptionalBehaviorSubject<HTMLElement | null>();

	// tslint:disable-next-line: member-ordering
	constructor(
		private host: ElementRef,
		private _viewContainer: ViewContainerRef,
		private tplRef: TemplateRef<any>
	) {
		this.parentElement$
			.pipe(
				filter(v => !!v),
				first()
			)
			.subscribe(() => this.scheduleCmptRendering());
	}

	ngAfterViewChecked() {
		if (!this.parentElement$.value)
			this.parentElement$.next((<Comment>this.host.nativeElement).parentElement);
	}

	ngOnDestroy() {
		this.destroyed$.complete();
	}

	private scheduleCmptRendering() {
		if (DelayedRenderDirective.instantViewsRenderingCounter <= DelayedRenderDirective.maxInstantRenderedViews)
			this.renderCmpt(); // to render in the current event loop a set number of views
		else
			// if the rendered views counter exceeds the max we schedule rendering to the next event loops
			timer((DelayedRenderDirective.instantViewsRenderingCounter - DelayedRenderDirective.maxInstantRenderedViews) * 3)
				.pipe(takeUntil(this.destroyed$))
				.subscribe(() => this.renderCmpt());

		DelayedRenderDirective.instantViewsRenderingCounter++;

		lineMicrotask(() => DelayedRenderDirective.instantViewsRenderingCounter = 0);
	}

	private renderCmpt() {
		this._viewContainer.createEmbeddedView(this.tplRef).detectChanges();
	}
}
