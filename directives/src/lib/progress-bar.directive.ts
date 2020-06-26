import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

import { $ } from '@bp/shared/utilities';

@Directive({
	selector: '[bpProgressBar]'
})
export class ProgressBarDirective implements OnChanges {

	@Input() bpProgressBar!: number | null;

	inProgress = false;

	get $host(): HTMLButtonElement { return this._host.nativeElement; }

	$progressBar = document.createElement('bp-progress-bar');

	constructor(private _host: ElementRef) { }

	ngOnChanges() {
		const progress = this.bpProgressBar || 0;
		const inProgress = progress > 0 && progress <= 100;

		if (inProgress !== this.inProgress) {
			$.setClass(this.$host, 'progress-bar', inProgress);
			setTimeout(() => $.setAttribute(this.$host, 'disabled', inProgress));
			this.inProgress = inProgress;
		}

		if (inProgress) {
			$.css(this.$progressBar, { width: `${ this.bpProgressBar }%` });
			!this.$progressBar.parentElement && this.$host.prepend(this.$progressBar);
		}

		if (!inProgress)
			this.$progressBar.remove();
	}

}
