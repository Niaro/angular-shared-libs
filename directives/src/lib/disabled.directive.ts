import { Directive, ElementRef, HostBinding, Input, OnChanges } from '@angular/core';
import { $ } from '@bp/shared/utilities';

@Directive({
	// tslint:disable-next-line: directive-selector
	selector: 'a[disabled], button[disabled], [bpDisabled]',
	host: {
		style: 'position: relative'
	}
})
export class DisabledDirective implements OnChanges {

	@Input() disabled!: boolean | '';

	@HostBinding('class.disabled')
	@Input()
	bpDisabled!: boolean | '';

	private get _$veil() { return this._$cachedVeil ?? (this._$cachedVeil = this._createVeil()); }
	private _$cachedVeil!: HTMLElement;

	private get _$host() { return <HTMLElement> this._host.nativeElement; }

	private _storedPointerEventsStyle!: string | null;

	private _storedTabIndex!: string | null;

	private _veiled = false;

	constructor(private _host: ElementRef) { }

	ngOnChanges() {
		if (!!this.disabled || !!this.bpDisabled)
			this._setVeil();
		else
			this._removeVeil();
	}

	private _setVeil() {
		if (this._veiled)
			return;

		this._storedPointerEventsStyle = this._$host.style.pointerEvents;
		this._storedTabIndex = this._$host.getAttribute('tabindex');
		this._$host.setAttribute('tabindex', '-1');
		this._$host.style.pointerEvents = 'none';
		this._$host.appendChild(this._$veil);
		this._veiled = true;
	}

	private _removeVeil() {
		if (!this._veiled)
			return;

		this._$host.style.pointerEvents = this._storedPointerEventsStyle!;
		if (this._storedTabIndex !== null)
			this._$host.setAttribute('tabindex', this._storedTabIndex);
		this._$veil.remove();
		this._veiled = false;
	}

	private _createVeil() {
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

		$veil.addEventListener('click', e => {
			e.stopPropagation();
			e.preventDefault();
		});

		return $veil;
	}
}
