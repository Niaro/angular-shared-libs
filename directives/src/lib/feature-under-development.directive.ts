import { AfterViewChecked, Directive, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { EnvironmentService } from '@bp/shared/services';

@Directive({
	selector: '[bpFeatureUnderDevelopment]'
})
export class FeatureUnderDevelopmentDirective implements AfterViewChecked {

	private _$host = <Comment> this._host.nativeElement;

	private _isDecorated = false;

	private _$targetsForDecoration = this._whenStagingOrDevRenderViewAndReturnTagetElements();

	constructor(
		private _host: ElementRef,
		private _viewContainer: ViewContainerRef,
		private _tplRef: TemplateRef<any>,
		private _env: EnvironmentService,
	) { }

	ngAfterViewChecked(): void {
		if (this._env.isStagingOrDev && this._$host.isConnected && !this._isDecorated)
			this._decorateToDrawAttention();
	}

	private _decorateToDrawAttention() {
		for (const $target of this._$targetsForDecoration)
			this._findClosestElementWithNotInlineDisplay($target)
				.classList
				.add('feature-under-development');

		this._isDecorated = true;
	}

	private _findClosestElementWithNotInlineDisplay($target: HTMLElement): HTMLElement {
		while (this._getDisplayStyle($target) === 'inline')
			if ($target.firstElementChild instanceof HTMLElement)
				$target = $target.firstElementChild;

		return $target;
	}

	private _getDisplayStyle($el: Element) {
		return getComputedStyle($el).display;
	}

	private _renderView() {
		const view = this._viewContainer
			.createEmbeddedView(this._tplRef);

		view.detectChanges();

		return view;
	}

	private _whenStagingOrDevRenderViewAndReturnTagetElements(): HTMLElement[] {
		return this._env.isStagingOrDev
			? this._renderView()
				.rootNodes
				.filter(v => v instanceof HTMLElement)
			: [];
	}

}
