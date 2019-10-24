import { Input, OnChanges, Directive, ElementRef } from '@angular/core';

import { $ } from '../utils';

@Directive({
	selector: '[bpProgressBar]'
})
export class ProgressBarDirective implements OnChanges {

	@Input() bpProgressBar!: number;

	inProgress = false;

	get $host(): HTMLButtonElement { return this.host.nativeElement; }

	$progressBar = document.createElement('bp-progress-bar');

	constructor(private host: ElementRef) { }

	ngOnChanges() {
		const inProgress = 0 < this.bpProgressBar && this.bpProgressBar <= 100;

		if (inProgress !== this.inProgress) {
			$.setClass(this.$host, 'progress-bar', inProgress);
			setTimeout(() => $.setAttribute(this.$host, 'disabled', inProgress));
			this.inProgress = inProgress;
		}

		if (inProgress) {
			$.css(this.$progressBar, { width: `${this.bpProgressBar}%` });
			!this.$progressBar.parentElement && this.$host.prepend(this.$progressBar);
		}

		if (!inProgress)
			this.$progressBar.remove();
	}

}
