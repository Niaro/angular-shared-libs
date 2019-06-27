import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { timer } from 'rxjs';

@Directive({ selector: '[bpDelayedRender]' })
export class DelayedRenderDirective {

	constructor(
		private _viewContainer: ViewContainerRef,
		private tplRef: TemplateRef<any>
	) {
		timer(0)
			.subscribe(() => this._viewContainer.createEmbeddedView(this.tplRef).detectChanges());
	}
}
