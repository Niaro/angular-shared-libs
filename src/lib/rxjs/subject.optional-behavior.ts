import { Subject, Subscriber, Subscription, ObjectUnsubscribedError } from 'rxjs';
import { SubscriptionLike } from 'rxjs';

export class OptionalBehaviorSubject<T> extends Subject<T> {
	private hasInitValue: boolean;
	private hasNextValue: boolean;

	constructor(private _value?: T) {
		super();
		this.hasInitValue = arguments.length === 1;
	}

	get value(): T {
		return this.getValue();
	}

	_subscribe(subscriber: Subscriber<T>): Subscription {
		const subscription = super._subscribe(subscriber);
		if (subscription && !(<SubscriptionLike>subscription).closed && (this.hasNextValue || this.hasInitValue))
			subscriber.next(this._value);

		return subscription;
	}

	getValue(): T {
		if (this.hasError)
			throw this.thrownError;
		else if (this.closed)
			throw new ObjectUnsubscribedError();
		else
			return this._value;
	}

	next(value: T): void {
		this.hasNextValue = true;
		super.next(this._value = value);
	}
}
