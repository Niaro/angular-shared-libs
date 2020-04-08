import { Component, ElementRef, ViewChild, ChangeDetectionStrategy, Input, HostListener } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ThemePalette } from '@angular/material/core';

const DEFAULT_TOOLTIP_MSG = 'Copy';

@Component({
	selector: '[bp-copy], bp-copy',
	templateUrl: './copy.component.html',
	styleUrls: [ './copy.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyComponent {
	@Input() value!: string;

	@Input() outlined = false;

	@Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

	@Input() color?: ThemePalette;

	@Input()
	get tooltipMsg() { return this._tooltipMsg; }
	set tooltipMsg(value: string) {
		this._tooltipMsg = value;
		this.tooltip = value;
	}
	private _tooltipMsg!: string;

	@ViewChild(MatTooltip, { static: true })
	mtTooltip!: MatTooltip;

	@ViewChild('clipboardTextarea', { static: true })
	/** @private */
	clipboardTextareaRef!: ElementRef;

	@ViewChild('content')
	/** @private */
	contentRef!: ElementRef;

	tooltip = DEFAULT_TOOLTIP_MSG;

	private get _$clipboardTextarea(): HTMLInputElement { return this.clipboardTextareaRef.nativeElement; }

	private get _$content(): HTMLElement { return this.contentRef.nativeElement; }

	/** @private */
	copy(e: MouseEvent) {
		e.stopPropagation();

		if (!e.ctrlKey && !e.metaKey && e.button === 0 /* main button */) {
			this._copyToClipboard();
			e.preventDefault();
		}
	}

	private _copyToClipboard() {
		this._$clipboardTextarea.value = (this.value || this._$content.innerText).trim();
		this._$clipboardTextarea.select();
		document.execCommand('copy');
		this.tooltip = 'Copied!';
		this.mtTooltip.show();
	}

	@HostListener('mouseleave')
	onMouseLeave() {
		setTimeout(() => this.tooltip = this.tooltipMsg || DEFAULT_TOOLTIP_MSG, this.mtTooltip.hideDelay);
	}
}
