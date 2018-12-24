// import { Observable } from 'rxjs';
// import { ResizeSensor } from 'css-element-queries';
// import { Dimensions } from '../models';
// import { RtScheduler } from './schedulers';

// export function resizeObserver(...targets: HTMLElement[]): Observable<IResizeObserverEntry> {
// 	return Observable
// 		.from(targets)
// 		.map(target => create(target))
// 		.mergeAll()
// 		.subscribeOn(RtScheduler.outside);

// 	function create(target: HTMLElement): Observable<IResizeObserverEntry> {
// 		return Observable
// 			.create(observer => {
// 				const onResize = () => observer.next();
// 				const sensor = new ResizeSensor(target, onResize);
// 				return () => sensor.detach(onResize);
// 			})
// 			.map(() => ({ target, width: target.offsetWidth, height: target.offsetHeight }))
// 			.distinctUntilChanged((x, y) => x.width === y.width && x.height === y.height);
// 	}
// }

// (<any>Observable).resize = resizeObserver;

// declare module 'rxjs/internal/Observable' {
// 	namespace Observable {
// 		// tslint:disable-next-line:no-var-keyword
// 		var resize: typeof resizeObserver;
// 	}
// }

// interface IResizeObserverEntry {
// 	readonly target: HTMLElement;
// 	readonly rect: Dimensions;
// }
