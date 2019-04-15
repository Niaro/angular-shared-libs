import { Component, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatButton } from '@angular/material';

@Component({
	selector: '[bp-copy]',
	templateUrl: './copy.component.html',
	styleUrls: ['./copy.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyComponent {
	@ViewChild('copyBtn') /** @private */ copyBtn: MatButton;
	@ViewChild('clipboardTextarea') /** @private */ clipboardTextareaRef: ElementRef;
	@ViewChild('content') /** @private */ contentRef: ElementRef;

	private get $clipboardTextarea(): HTMLInputElement { return this.clipboardTextareaRef.nativeElement; }
	private get $content(): HTMLElement { return this.contentRef.nativeElement; }

	/** @private */
	copy(e: MouseEvent) {
		e.stopPropagation();

		if (!e.ctrlKey && !e.metaKey && e.button === 0 /* main button */) {
			this.copyToClipboard();
			this.copyBtn.focus();
			e.preventDefault();
		}
	}

	private copyToClipboard() {
		this.$clipboardTextarea.value = this.$content.innerText.trim();
		this.$clipboardTextarea.select();
		document.execCommand('copy');
	}
}
