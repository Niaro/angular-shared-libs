import { Component, OnChanges, ChangeDetectionStrategy, Input, SimpleChanges } from '@angular/core';
import { fromEvent, BehaviorSubject } from 'rxjs';
import { first, delay, tap, map } from 'rxjs/operators';

import { pending } from '@bp/shared/rxjs';

@Component({
	selector: 'bp-img',
	templateUrl: './img.component.html',
	styleUrls: ['./img.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImgComponent implements OnChanges {

	@Input() url!: string;

	@Input() size = 50;

	showImg$ = new BehaviorSubject(false);

	isDownloading$ = new BehaviorSubject(true);

	src!: string | null;

	ngOnChanges({ url }: SimpleChanges) {
		if (url && this.url)
			this.loadImg(this.url);
		else {
			this.src = null;
			this.isDownloading$.next(false);
		}
	}

	private loadImg(url: string) {
		const img = new Image();
		img.src = url;

		if (img.complete) {
			this.src = url;
			this.showImg$.next(true);
			this.isDownloading$.next(false);
		} else
			fromEvent(img, 'load')
				.pipe(
					first(),
					pending(this.isDownloading$),
					tap(() => this.src = url),
					delay(100), // the time for the img to be rendered
					map(() => true)
				)
				.subscribe(this.showImg$);
	}

}
