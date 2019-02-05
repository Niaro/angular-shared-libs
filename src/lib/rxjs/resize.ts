import { Observable, from } from 'rxjs';
import { map, mergeAll, subscribeOn, distinctUntilChanged } from 'rxjs/operators';
import { ResizeSensor } from 'css-element-queries';

import { BpScheduler } from './schedulers';
import { measure } from './measure.operator';

export function resizeObserver(...targets: HTMLElement[]): Observable<IResizeObserverEntry> {
	return from(targets)
		.pipe(
			map(target => create(target)),
			mergeAll(),
			subscribeOn(BpScheduler.outside)
		);

	function create(target: HTMLElement): Observable<IResizeObserverEntry> {
		return Observable
			.create(observer => {
				const onResize = () => observer.next();
				const sensor = new ResizeSensor(target, onResize);
				return () => sensor.detach(onResize);
			})
			.pipe(
				measure(() => ({
					target,
					width: target.offsetWidth,
					height: target.offsetHeight
				})),
				distinctUntilChanged((x: IResizeObserverEntry, y: IResizeObserverEntry) => x.width === y.width && x.height === y.height)
			);
	}
}

(<any>Observable).resize = resizeObserver;

declare module 'rxjs/internal/Observable' {
	namespace Observable {
		// tslint:disable-next-line:no-var-keyword
		var resize: typeof resizeObserver;
	}
}

interface IResizeObserverEntry {
	readonly target: HTMLElement;
	readonly width: number;
	readonly height: number;
}
