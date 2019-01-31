import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Point, Vector, Direction, RtScheduler } from '../../core';

const DOUBLE_TAP_TIME = 250;
const LONG_TAP_TIME = 750;
const MOVE_MIN_LENGTH = 10;
const SWIPE_MIN_LENGTH = 30;

@Injectable()
export class TouchBuilder {
	constructor(private zone: NgZone) { }

	build(elementOrSelector: string | Element): TouchManager {
		let $element = _.isString(elementOrSelector) ? document.querySelector(elementOrSelector) : elementOrSelector;
		return new TouchManager($element, this.zone);
	}
}

export class TouchManager {
	static events = [ // TODO: Change to string enums after TS 2.4 release
		'touchStart', 'touchMove', 'touchEnd', 'touchCancel',
		'tap', 'singleTap', 'doubleTap', 'longTap',
		'pan', 'swipe', 'pinch', 'rotate'];

	touchStart$: Observable<TouchEvent>;
	touchMove$: Observable<TouchEvent>;
	touchEnd$: Observable<TouchEvent>;
	touchCancel$: Observable<TouchEvent>;

	tap$: Observable<TouchEvent>;
	singleTap$: Observable<TouchEvent>;
	doubleTap$: Observable<TouchEvent>;
	longTap$: Observable<TouchEvent>;

	pan$: Observable<IPanEvent>;
	swipe$: Observable<ISwipeEvent>;
	pinch$: Observable<IPinchEvent>;
	rotate$: Observable<IRotateEvent>;

	private isMoved: boolean;
	private isDoubleTap: boolean;
	private startPosition: Point;
	private lastPosition: Point;
	private lastVector: Vector;

	// position at previous tap
	private prevPosition: Point;
	private prevTime: Date;

	private timeouts = new Map<TimeoutType, number>();
	private subjects: { [event: string]: Subject<TouchEvent> } = {};
	private subscriptions: Subscription[] = [];

	constructor($element: Element, zone: NgZone) {
		this.subscriptions.push(...zone.runOutsideAngular(() => [
			Observable.fromEvent<TouchEvent>($element, 'touchstart').subscribe(e => this.onStart(e)),
			Observable.fromEvent<TouchEvent>($element, 'touchmove').subscribe(e => this.onMove(e)),
			Observable.fromEvent<TouchEvent>($element, 'touchend').subscribe(e => this.onEnd(e)),
			Observable.fromEvent<TouchEvent>($element, 'touchcancel').subscribe(e => this.onCancel(e))
		]));

		TouchManager.events.forEach(event => {
			this.subjects[event] = new Subject();
			this[`${event}$`] = this.subjects[event].observeOn(RtScheduler.runInAngularZone);
		});
	}

	destroy() {
		this.cancel();
		this.subscriptions.forEach(s => s.unsubscribe());
		TouchManager.events.forEach(event => this.subjects[event].complete());
	}

	private onStart(e: TouchEvent) {
		this.subjects.touchStart.next(e);

		let pos = new Point(e.touches[0].pageX, e.touches[0].pageY);
		let now = new Date();
		if (e.touches.length === 1) {
			// reset values
			this.isMoved = false;
			this.isDoubleTap = false;
			this.startPosition = pos;

			// handle double tap
			if (this.prevPosition) {
				let elapsed = +now - +this.prevTime;
				this.isDoubleTap = elapsed <= DOUBLE_TAP_TIME;
			}

			this.timeouts.set(TimeoutType.longTap, +setTimeout(() => this.subjects.longTap.next(e), LONG_TAP_TIME));
		}
		else {
			!this.startPosition && (this.startPosition = pos);
			let second = new Point(e.touches[1].pageX, e.touches[1].pageY);
			this.lastVector = second.diff(pos);
		}

		this.prevPosition = this.lastPosition = pos;
		this.prevTime = now;
	}

	private onMove(e: TouchEvent) {
		this.subjects.touchMove.next(e);

		let pos = new Point(e.touches[0].pageX, e.touches[0].pageY);
		let move = this.startPosition.diff(pos);
		if (move.length() >= MOVE_MIN_LENGTH) {
			this.isMoved = true;
			this.cancel(TimeoutType.singleTap);
			this.cancel(TimeoutType.longTap);
		}

		if (this.isMoved) {
			if (e.touches.length > 1) {
				let second = new Point(e.touches[1].pageX, e.touches[1].pageY);
				let vector = second.diff(pos);

				if (this.lastVector) {
					let prevLength = this.lastVector.length();
					if (prevLength > 0) {
						(<IPinchEvent>e).rtScale = vector.length() / prevLength;
						this.subjects.pinch.next(e);
					}
					(<IRotateEvent>e).rtAngle = vector.getAngleDegree(this.lastVector);
					this.subjects.rotate.next(e);
				}

				this.lastVector = vector;
			} else {
				let pe = e as IPanEvent;
				pe.rtDeltaX = pos.x - this.startPosition.x;
				pe.rtDeltaY = pos.y - this.startPosition.y;
				this.subjects.pan.next(pe);
			}

			this.lastPosition = pos;
		}

		if (this.subjects.pinch.observers.length || this.subjects.rotate.observers.length || this.subjects.pan.observers.length)
			e.preventDefault();
	}

	private onEnd(e: TouchEvent) {
		this.cancel(TimeoutType.longTap);
		this.subjects.touchEnd.next(e);

		if (e.touches.length == 0) {
			let move = this.lastPosition.diff(this.startPosition);

			// swipe
			if (move.length() > SWIPE_MIN_LENGTH) {
				this.cancel(TimeoutType.singleTap);
				(<ISwipeEvent>e).rtDirection = move.direction();
				this.subjects.swipe.next(e);
			// tap
			} else if (!this.isMoved) {
				this.subjects.tap.next(e);

				if (this.isDoubleTap) {
					this.cancel(TimeoutType.singleTap);
					this.subjects.doubleTap.next(e);
				} else
					this.timeouts.set(TimeoutType.singleTap, +setTimeout(() => this.subjects.singleTap.next(e), DOUBLE_TAP_TIME));
			}
		}
	}

	private onCancel(e: TouchEvent) {
		this.cancel();
		this.subjects.touchCancel.next(e);
	}

	private cancel(type?: TimeoutType) {
		type ? clearTimeout(this.timeouts.get(type)) : this.timeouts.forEach(tmout => clearTimeout(tmout));
	}
}

export interface IRotateEvent extends TouchEvent {
	rtAngle: number;
}

export interface IPinchEvent extends TouchEvent {
	rtScale: number;
}

export interface ISwipeEvent extends TouchEvent {
	rtDirection: Direction;
}

export interface IPanEvent extends TouchEvent {
	rtDeltaX: number;
	rtDeltaY: number;
}

enum TimeoutType {
	singleTap,
	longTap
}