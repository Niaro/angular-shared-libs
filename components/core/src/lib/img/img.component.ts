import { BehaviorSubject, fromEvent } from 'rxjs';
import { delay, first, takeUntil, tap } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Destroyable } from '@bp/shared/models/common';

@Component({
	selector: 'bp-img',
	templateUrl: './img.component.html',
	styleUrls: [ './img.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImgComponent extends Destroyable implements OnChanges {

	@Input() url?: string | null;

	@Input() size = 50;

	showImg$ = new BehaviorSubject(false);

	isDownloading$ = new BehaviorSubject(true);

	src!: string | null;

	ngOnChanges({ url }: SimpleChanges) {
		if (url && this.url)
			this._loadImg(this.url);
		else {
			this.src = null;
			this.isDownloading$.next(false);
		}
	}

	private _loadImg(url: string) {
		this.isDownloading$.next(true);
		const img = new Image();
		img.src = url;

		if (img.complete) {
			this.src = url;
			this.isDownloading$.next(false);
		} else
			fromEvent(img, 'load')
				.pipe(
					first(),
					tap(() => this.src = url),
					delay(100),  // wait til the img is rendered then show it to apply smooth animation
					this.takeUntilDestroyed,
					takeUntil(fromEvent(img, 'error')),
				)
				.subscribe({ complete: () => this.isDownloading$.next(false) });
	}

}
