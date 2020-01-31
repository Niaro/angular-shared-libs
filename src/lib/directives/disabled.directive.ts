import { Directive, Input, OnChanges, ElementRef } from '@angular/core';

import { $ } from '../utils';

@Directive({
	// tslint:disable-next-line: directive-selector
	selector: 'a[disabled], button[disabled]'
})
export class DisabledDirective implements OnChanges {

	@Input() disabled!: boolean;

	private get $veil() { return this._$veil ?? (this._$veil = this.createVeil()); }
	private _$veil!: HTMLElement;

	private get $host() { return this.host.nativeElement as HTMLElement; }

	private store$dPointerEventsStyle!: string | null;

	private store$dTabIndex!: string | null;

	constructor(private host: ElementRef) { }

	ngOnChanges() {
		if (this.disabled)
			this.setVeil();
		else
			this.removeVeil();
	}

	private setVeil() {
		this.store$dPointerEventsStyle = this.$host.style.pointerEvents;
		this.store$dTabIndex = this.$host.getAttribute('tabindex');
		this.$host.setAttribute('tabindex', '-1');
		this.$host.style.pointerEvents = 'none';
		this.$host.appendChild(this.$veil);
	}

	private removeVeil() {
		this.$host.style.pointerEvents = this.store$dPointerEventsStyle;
		if (this.store$dTabIndex !== null)
			this.$host.setAttribute('tabindex', this.store$dTabIndex);
		this.$veil.remove();
	}

	private createVeil() {
		const $veil = document.createElement('span');

		$.css($veil, {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			'pointer-events': 'all',
			cursor: 'not-allowed'
		});

		$veil.addEventListener('click', (e: MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();
		});

		return $veil;
	}
}
