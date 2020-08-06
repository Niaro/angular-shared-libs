import { isEmpty } from 'lodash-es';
import tippy, {
	animateFill, Instance as Tippy, Placement as TippyPlacement, Props as TippyConfig
} from 'tippy.js';

import { Directive, ElementRef, Input, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { cancelIdleCallback, requestIdleCallback, RequestIdleCallbackId } from '@bp/shared/utilities';

type RequiredTippyConfig = Pick<TippyConfig, 'placement' | 'content'>;

/**
 * Tooltip directive based on Tippy.js
 *
 * @link https://atomiks.github.io/tippyjs/v6/getting-started/
 */
@Directive({
	selector: '[bpTooltip]'
})
export class TooltipDirective implements OnChanges, OnDestroy {

	@Input('bpTooltip') content?: string | '' | null = null;

	@Input('bpTooltipPlacement') placement: TippyPlacement = 'top';

	private _tippy: Tippy | null = null;

	private _destroyed = false;

	private _awaitingTaskId!: RequestIdleCallbackId;

	constructor(
		private _host: ElementRef,
		private _zone: NgZone
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		this._handleTooltipConfigChange();
	}

	ngOnDestroy(): void {
		this._destroyed = true;
		this._destroyTippy();
	}

	private _handleTooltipConfigChange(): void {
		if (isEmpty(this.content)) {
			this._destroyTippy();

			return;
		}

		const config: RequiredTippyConfig = {
			content: this.content!,
			placement: this.placement
		};

		if (this._tippy)
			this._updateTippy(config);
		else
			this._createTippy(config);
	}

	private _createTippy(config: Partial<TippyConfig> & RequiredTippyConfig): void {
		this._runOutsideWhenIdleAndDirectiveNotDestroyed(() => this._tippy = tippy(
			<HTMLElement> this._host.nativeElement,
			{
				arrow: false,
				ignoreAttributes: true,
				theme: 'material',
				animateFill: true,
				plugins: [ animateFill ],
				allowHTML: true,
				...config,
			}
		));
	}

	private _updateTippy(config: Partial<TippyConfig>): void {
		this._runOutsideWhenIdleAndDirectiveNotDestroyed(
			() => this._tippy?.setProps(config)
		);
	}

	private _destroyTippy(): void {
		this._runOutsideWhenIdle(() => {
			this._tippy?.destroy();
			this._tippy = null;
		});
	}

	private _runOutsideWhenIdle(task: () => void): void {
		// if a new task came but the previous hasn't started or been finished we cancel it since we don't need
		// the task done anymore
		cancelIdleCallback(this._awaitingTaskId);

		this._awaitingTaskId = this._zone.runOutsideAngular(
			() => requestIdleCallback(task, { timeout: 500 })
		);
	}

	private _runOutsideWhenIdleAndDirectiveNotDestroyed(task: () => void): void {
		this._runOutsideWhenIdle(() => !this._destroyed && task());
	}
}
