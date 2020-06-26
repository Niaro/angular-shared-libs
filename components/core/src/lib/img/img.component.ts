import { BehaviorSubject, fromEvent } from 'rxjs';
import { delay, first, share } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { pending } from '@bp/shared/rxjs';

@Component({
	selector: 'bp-img',
	templateUrl: './img.component.html',
	styleUrls: [ './img.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImgComponent implements OnChanges {

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
		const img = new Image();
		img.src = url;

		if (img.complete) {
			this.src = url;
			this.showImg$.next(true);
			this.isDownloading$.next(false);
		} else {
			const load$ = fromEvent(img, 'load')
				.pipe(
					first(),
					pending(this.isDownloading$),
					share()
				);
			load$
				.subscribe(() => this.src = url);

			load$
				.pipe(delay(100)) // wait til the img is rendered then show it to apply smooth animation
				.subscribe(() => this.showImg$.next(true));
		}
	}

}
