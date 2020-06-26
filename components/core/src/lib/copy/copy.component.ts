import { ToastrService } from 'ngx-toastr';

import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
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

	private _tooltip?: string;

	@Input()
	get tooltip() { return this._tooltip || DEFAULT_TOOLTIP_MSG; }
	set tooltip(value: string) {
		this._tooltip = value;
	}

	@ViewChild('clipboardTextarea', { static: true })
	/** @private */
	clipboardTextareaRef!: ElementRef;

	@ViewChild('content')
	/** @private */
	contentRef!: ElementRef;

	private get _$clipboardTextarea(): HTMLInputElement { return this.clipboardTextareaRef.nativeElement; }

	private get _$content(): HTMLElement { return this.contentRef.nativeElement; }

	constructor(private _toaster: ToastrService) { }

	/** @private */
	copy(e: MouseEvent) {
		e.stopPropagation();

		if (!e.ctrlKey && !e.metaKey && e.button === 0 /* main button */) {
			this._copyToClipboard();
			e.preventDefault();
		}
	}

	private _copyToClipboard() {
		const value = this._$clipboardTextarea.value = (this.value || this._$content.innerText).trim();
		this._$clipboardTextarea.select();
		document.execCommand('copy');
		this._toaster.info(value, 'Value has been copied!', { timeOut: 1500 });
	}

}
