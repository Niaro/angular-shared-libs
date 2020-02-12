import { Subject, Subscriber, Subscription, ObjectUnsubscribedError } from 'rxjs';
import { SubscriptionLike } from 'rxjs';

export class OptionalBehaviorSubject<T> extends Subject<T> {

	private _hasInitValue: boolean;

	private _hasNextValue: boolean | undefined;

	constructor(private _value?: T) {
		super();
		this._hasInitValue = arguments.length === 1;
	}

	get value(): T | undefined {
		return this.getValue();
	}

	// tslint:disable-next-line: naming-convention
	_subscribe(subscriber: Subscriber<T>): Subscription {
		const subscription = super._subscribe(subscriber);
		if (subscription && !(<SubscriptionLike>subscription).closed && (this._hasNextValue || this._hasInitValue))
			subscriber.next(this._value);

		return subscription;
	}

	getValue(): T | undefined {
		if (this.hasError)
			throw this.thrownError;

		if (this.closed)
			throw new ObjectUnsubscribedError();

		return this._value;
	}

	next(value: T): void {
		this._hasNextValue = true;
		super.next(this._value = value);
	}
}
