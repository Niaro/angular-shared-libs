import { Observable, from } from 'rxjs';
import { map, mergeAll, distinctUntilChanged } from 'rxjs/operators';

import { ResizeSensor } from '../utils/resize-sensor';

import { BpScheduler } from './schedulers';
import { measure } from './measure.operator';


export function resizeObserver(...targets: HTMLElement[]): Observable<IResizeObserverEntry> {
	return from(targets, BpScheduler.asyncOutside)
		.pipe(
			map(target => create(target)),
			mergeAll()
		);

	function create(target: HTMLElement): Observable<IResizeObserverEntry> {
		return new Observable
			(observer => {
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
