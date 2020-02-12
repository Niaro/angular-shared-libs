import { Directive, TemplateRef, ViewContainerRef, Input, ElementRef, AfterViewChecked } from '@angular/core';
import { timer } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { lineMicrotask } from '@bp/shared/utils';

import { OptionalBehaviorSubject } from '../rxjs';
import { Destroyable } from '../components/destroyable';

/**
 * Rendering a significant amount of complex components in one event loop can create a visible freezes of the UI
 * so this directive batches waiting for rendering components between event loops, so each one of them will contain
 * a manageable amount of work
 */
@Directive({ selector: '[bpDelayedRender]' })
export class DelayedRenderDirective extends Destroyable implements AfterViewChecked {

	@Input('bpDelayedRender') id!: string;

	private static _instantViewsRenderingCounter = 0;

	private static readonly _maxInstantRenderedViews = 7;

	private _parentElement$ = new OptionalBehaviorSubject<HTMLElement | null>();

	// tslint:disable-next-line: member-ordering
	constructor(
		private _host: ElementRef,
		private _viewContainer: ViewContainerRef,
		private _tplRef: TemplateRef<any>
	) {
		super();

		this._parentElement$
			.pipe(
				filter(v => !!v),
				first()
			)
			.subscribe(() => this._scheduleCmptRendering());
	}

	ngAfterViewChecked() {
		if (!this._parentElement$.value)
			this._parentElement$.next((<Comment>this._host.nativeElement).parentElement);
	}

	private _scheduleCmptRendering() {
		if (DelayedRenderDirective._instantViewsRenderingCounter <= DelayedRenderDirective._maxInstantRenderedViews)
			this._renderCmpt(); // to render in the current event loop a set number of views
		else
			// if the rendered views counter exceeds the max we schedule rendering to the next event loops
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
