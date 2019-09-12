import { NgZone } from '@angular/core';
import { Observable, Subject, Subscription, fromEvent } from 'rxjs';
import { observeOn } from 'rxjs/operators';

import { Point, Vector, Direction } from '@bp/shared/models/misc';
import { BpScheduler } from '@bp/shared/rxjs';
import { set } from 'lodash-es';

const DOUBLE_TAP_TIME = 250;
const LONG_TAP_TIME = 750;
const MOVE_MIN_LENGTH = 10;
const SWIPE_MIN_LENGTH = 30;

export class TouchManager {
	static events = [ // TODO: Change to string enums after TS 2.4 release
		'touchStart', 'touchMove', 'touchEnd', 'touchCancel',
		'tap', 'singleTap', 'doubleTap', 'longTap',
		'pan', 'swipe', 'pinch', 'rotate'
	];

	touchStart$!: Observable<TouchEvent>;
	touchMove$!: Observable<TouchEvent>;
	touchEnd$!: Observable<TouchEvent>;
	touchCancel$!: Observable<TouchEvent>;

	tap$!: Observable<TouchEvent>;
	singleTap$!: Observable<TouchEvent>;
	doubleTap$!: Observable<TouchEvent>;
	longTap$!: Observable<TouchEvent>;

	pan$!: Observable<IPanEvent>;
	swipe$!: Observable<ISwipeEvent>;
	pinch$!: Observable<IPinchEvent>;
	rotate$!: Observable<IRotateEvent>;

	private isMoved!: boolean;
	private isDoubleTap!: boolean;
	private startPosition!: Point;
	private lastPosition!: Point;
	private lastVector!: Vector;

	// position at previous tap
	// position at previous tap
	private prevPosition!: Point;
	private prevTime!: Date;

	private timeouts = new Map<TimeoutType, number>();
	private subjects: { [event: string]: Subject<TouchEvent> } = {};
	private subscriptions: Subscription[] = [];

	constructor($element: Element, zone: NgZone) {
		this.subscriptions.push(...zone.runOutsideAngular(() => [
			fromEvent<TouchEvent>($element, 'touchstart').subscribe(e => this.onStart(e)),
			fromEvent<TouchEvent>($element, 'touchmove').subscribe(e => this.onMove(e)),
			fromEvent<TouchEvent>($element, 'touchend').subscribe(e => this.onEnd(e)),
			fromEvent<TouchEvent>($element, 'touchcancel').subscribe(e => this.onCancel(e))
		]));

		TouchManager.events.forEach(event => {
			this.subjects[event] = new Subject();
			set(this, `${event}$`, this.subjects[event].pipe(observeOn(BpScheduler.runInAngularZone)));
		});
	}

	destroy() {
		this.cancel();
		this.subscriptions.forEach(s => s.unsubscribe());
		TouchManager.events.forEach(event => this.subjects[event].complete());
	}

	private onStart(e: TouchEvent) {
		this.subjects.touchStart.next(e);

		const pos = new Point(e.touches[0].pageX, e.touches[0].pageY);
		const now = new Date();
		if (e.touches.length === 1) {
			// reset values
			this.isMoved = false;
			this.isDoubleTap = false;
			this.startPosition = pos;

			// handle double tap
			if (this.prevPosition) {
				const elapsed = +now - +this.prevTime;
				this.isDoubleTap = elapsed <= DOUBLE_TAP_TIME;
			}

			this.timeouts.set(TimeoutType.longTap, +setTimeout(() => this.subjects.longTap.next(e), LONG_TAP_TIME));
		} else {
			!this.startPosition && (this.startPosition = pos);
			const second = new Point(e.touches[1].pageX, e.touches[1].pageY);
			this.lastVector = second.diff(pos);
		}

		this.prevPosition = this.lastPosition = pos;
		this.prevTime = now;
	}

	private onMove(e: TouchEvent) {
		this.subjects.touchMove.next(e);

		const pos = new Point(e.touches[0].pageX, e.touches[0].pageY);
		const move = this.startPosition.diff(pos);
		if (move.length() >= MOVE_MIN_LENGTH) {
			this.isMoved = true;
			this.cancel(TimeoutType.singleTap);
			this.cancel(TimeoutType.longTap);
		}

		if (this.isMoved) {
			if (e.touches.length > 1) {
				const second = new Point(e.touches[1].pageX, e.touches[1].pageY);
				const vector = second.diff(pos);

				if (this.lastVector) {
					const prevLength = this.lastVector.length();
					if (prevLength > 0) {
						(<IPinchEvent>e).bpScale = vector.length() / prevLength;
						this.subjects.pinch.next(e);
					}
					(<IRotateEvent>e).bpAngle = vector.getAngleDegree(this.lastVector);
					this.subjects.rotate.next(e);
				}

				this.lastVector = vector;
			} else {
				const pe = e as IPanEvent;
				pe.bpDeltaX = pos.x - this.startPosition.x;
				pe.bpDeltaY = pos.y - this.startPosition.y;
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

		if (e.touches.length === 0) {
			const move = this.lastPosition.diff(this.startPosition);

			// swipe
			if (move.length() > SWIPE_MIN_LENGTH) {
				this.cancel(TimeoutType.singleTap);
				(<ISwipeEvent>e).bpDirection = move.direction();
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
	bpAngle: number;
}

export interface IPinchEvent extends TouchEvent {
	bpScale: number;
}

export interface ISwipeEvent extends TouchEvent {
	bpDirection: Direction;
}

export interface IPanEvent extends TouchEvent {
	bpDeltaX: number;
	bpDeltaY: number;
}

enum TimeoutType {
	singleTap,
	longTap
}
