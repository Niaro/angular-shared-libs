import { Component, ElementRef, ViewChild, ChangeDetectionStrategy, Input, HostListener } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

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

	@ViewChild(MatTooltip, { static: true })
	mtTooltip!: MatTooltip;

	@ViewChild('clipboardTextarea', { static: true })
	/** @private */
	clipboardTextareaRef!: ElementRef;

	@ViewChild('content')
	/** @private */
	contentRef!: ElementRef;

	tooltipMsg = DEFAULT_TOOLTIP_MSG;

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
		this.tooltipMsg = 'Copied!';
		this.mtTooltip.show();
	}

	@HostListener('mouseleave')
	onMouseLeave() {
		setTimeout(() => this.tooltipMsg = DEFAULT_TOOLTIP_MSG, this.mtTooltip.hideDelay);
	}
}
