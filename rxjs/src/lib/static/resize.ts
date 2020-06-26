import { Observable, scheduled } from 'rxjs';
import { distinctUntilChanged, map, mergeAll } from 'rxjs/operators';

import { ResizeSensor } from '@bp/shared/utilities';

import { measure } from '../fastdom-wrappers';
import { BpScheduler } from '../schedulers';

export function fromResize(...targets: HTMLElement[]) {
	return scheduled(targets, BpScheduler.asyncOutside)
		.pipe(
			map(create),
			mergeAll()
		);

	function create(target: HTMLElement): Observable<IResizeObserverEntry> {
		return new Observable
			(subscriber => {
				const onResize = () => subscriber.next();
				const sensor = new ResizeSensor(target, onResize);

				return () => sensor.detach(onResize);
			})
			.pipe(
				measure(() => ({
					target,
					width: target.offsetWidth,
					height: target.offsetHeight
				})),
				distinctUntilChanged(
					(a: IResizeObserverEntry, b: IResizeObserverEntry) => a.width === b.width && a.height === b.height
				)
			);
	}
}

interface IResizeObserverEntry {
	readonly target: HTMLElement;
	readonly width: number;
	readonly height: number;
}
