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

	private _isMoved!: boolean;

	private _isDoubleTap!: boolean;

	private _startPosition!: Point;

	private _lastPosition!: Point;

	private _lastVector!: Vector;

	// position at previous tap
	private _prevPosition!: Point;

	private _prevTime!: Date;

	private _timeouts = new Map<TimeoutType, number>();

	private _subjects: { [ event: string ]: Subject<TouchEvent>; } = {};

	private _subscriptions: Subscription[] = [];

	constructor($element: Element, zone: NgZone) {

		this._subscriptions.push(...zone.runOutsideAngular(() => [
			fromEvent<TouchEvent>($element, 'touchstart').subscribe(e => this._onStart(e)),
			fromEvent<TouchEvent>($element, 'touchmove').subscribe(e => this._onMove(e)),
			fromEvent<TouchEvent>($element, 'touchend').subscribe(e => this._onEnd(e)),
			fromEvent<TouchEvent>($element, 'touchcancel').subscribe(e => this._onCancel(e))
		]));

		TouchManager.events.forEach(event => {
			this._subjects[ event ] = new Subject();
			set(this, `${ event }$`, this._subjects[ event ].pipe(observeOn(BpScheduler.inside)));
		});
	}

	destroy() {
		this._cancel();
		this._subscriptions.forEach(s => s.unsubscribe());
		TouchManager.events.forEach(event => this._subjects[ event ].complete());
	}

	private _onStart(e: TouchEvent) {
		this._subjects.touchStart.next(e);

		const pos = new Point(e.touches[ 0 ].pageX, e.touches[ 0 ].pageY);
		const now = new Date();
		if (e.touches.length === 1) {
			// reset values
			this._isMoved = false;
			this._isDoubleTap = false;
			this._startPosition = pos;

			// handle double tap
			if (this._prevPosition) {
				const elapsed = +now - +this._prevTime;
				this._isDoubleTap = elapsed <= DOUBLE_TAP_TIME;
			}

			this._timeouts.set(TimeoutType.LongTap, +setTimeout(() => this._subjects.longTap.next(e), LONG_TAP_TIME));
		} else {
			!this._startPosition && (this._startPosition = pos);
			const second = new Point(e.touches[ 1 ].pageX, e.touches[ 1 ].pageY);
			this._lastVector = second.diff(pos);
		}

		this._prevPosition = this._lastPosition = pos;
		this._prevTime = now;
	}

	private _onMove(e: TouchEvent) {
		this._subjects.touchMove.next(e);

		const pos = new Point(e.touches[ 0 ].pageX, e.touches[ 0 ].pageY);
		const move = this._startPosition.diff(pos);
		if (move.length() >= MOVE_MIN_LENGTH) {
			this._isMoved = true;
			this._cancel(TimeoutType.SingleTap);
			this._cancel(TimeoutType.LongTap);
		}

		if (this._isMoved) {
			if (e.touches.length > 1) {
				const second = new Point(e.touches[ 1 ].pageX, e.touches[ 1 ].pageY);
				const vector = second.diff(pos);

				if (this._lastVector) {
					const prevLength = this._lastVector.length();
					if (prevLength > 0) {
						(<IPinchEvent> e).bpScale = vector.length() / prevLength;
						this._subjects.pinch.next(e);
					}
					(<IRotateEvent> e).bpAngle = vector.getAngleDegree(this._lastVector);
					this._subjects.rotate.next(e);
				}

				this._lastVector = vector;
			} else {
				const pe = <IPanEvent> e;
				pe.bpDeltaX = pos.x - this._startPosition.x;
				pe.bpDeltaY = pos.y - this._startPosition.y;
				this._subjects.pan.next(pe);
			}

			this._lastPosition = pos;
		}

		if (this._subjects.pinch.observers.length
			|| this._subjects.rotate.observers.length
			|| this._subjects.pan.observers.length
		)
			e.preventDefault();
	}

	private _onEnd(e: TouchEvent) {
		this._cancel(TimeoutType.LongTap);
		this._subjects.touchEnd.next(e);

		if (!e.touches.length)
			return;

		const move = this._lastPosition.diff(this._startPosition);

		// swipe
		if (move.length() > SWIPE_MIN_LENGTH) {
			this._cancel(TimeoutType.SingleTap);
			(<ISwipeEvent> e).bpDirection = move.direction();
			this._subjects.swipe.next(e);
			// tap
		} else if (!this._isMoved) {
			this._subjects.tap.next(e);

			if (this._isDoubleTap) {
				this._cancel(TimeoutType.SingleTap);
				this._subjects.doubleTap.next(e);
			} else
				this._timeouts.set(TimeoutType.SingleTap, +setTimeout(() => this._subjects.singleTap.next(e), DOUBLE_TAP_TIME));
		}
	}

	private _onCancel(e: TouchEvent) {
		this._cancel();
		this._subjects.touchCancel.next(e);
	}

	private _cancel(type?: TimeoutType) {
		type ? clearTimeout(this._timeouts.get(type)) : this._timeouts.forEach(tmout => clearTimeout(tmout));
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

	SingleTap,

	LongTap

}
