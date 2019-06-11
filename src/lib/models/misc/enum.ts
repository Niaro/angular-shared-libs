import { camelCase, lowerCase, forOwn, isNil, isNumber, isArray, upperFirst } from 'lodash-es';

export abstract class Enumeration {
	static list(): Enumeration[] {
		if (!this['_list_']) {
			const list = [];
			forOwn(this, (it, key) => {
				if (it instanceof Enumeration && isNaN(+key) && this.shouldList(it))
					list.push(it);
			});
			this['_list_'] = list;
		}
		return this['_list_'];
	}

	static find(value: number | string): Enumeration {
		return this[value];
	}

	static parse(data: number | string | Enumeration): Enumeration {
		if (data instanceof Enumeration || isNil(data))
			return data;
		else if (isNumber(data))
			return this.find(data);
		return this[camelCase(data)];
	}

	static parseStrict(data: number | string | Enumeration): Enumeration {
		const result = this.parse(data);
		if (!result)
			throw new Error(`Enum type ${this.name} does not contains value ${data}`);
		return result;
	}

	static isInstance(value: any) { return value instanceof this; }

	protected static shouldList(value: Enumeration) {
		return true;
	}

	get displayName(): string { return this._displayName || this.name || this._value.toString(); }

	name: string;

	// TODO Angular CLI mangles the names of class constructors which is used for generating cssClass, check somewhere later
	// cssClass: string;

	protected _value: number | string;
	protected _displayName: string;

	private id = `enum_${Math.random().toString(36).substr(2, 8)}`;

	constructor(displayName?: string);
	constructor(value: number, displayName?: string);
	constructor(valueOrDisplayName?: number | string, displayName?: string) {
		// do not access the {name} property in the constructor because it is lazy initialized and required all static properties to be present

		if (isNumber(valueOrDisplayName)) {
			this._value = valueOrDisplayName.valueOf();
			this.constructor[this._value] = this;
			this._displayName = displayName;

			// Schedule a microtask at the end of the current event loop
			// which means that the constructor will have all the enumerations attached to it by the time
			// the callback is fired and we are able to find by the id of the enum its name amidst the static properties
			Promise.resolve().then(() => this.init());
		} else {
			this._displayName = valueOrDisplayName;

			// same as the comment above
			Promise.resolve().then(() => this.init({ valueSameAsName: true }));
		}
	}

	valueOf() {
		return this._value;
	}

	toString(): string {
		return this._value.toString();
	}

	toJSON() {
		return this._value;
	}

	private init({ valueSameAsName }: { valueSameAsName: boolean } = <any>{}) {
		this.name = this.getValueName();
		// this.cssClass = this.getCssClass();
		this._displayName = this._displayName || upperFirst(lowerCase(this.name));

		if (valueSameAsName)
			this._value = this.name;
	}

	// private getCssClass() {
	// 	return `${kebabCase(this.constructor.name)}-${kebabCase(this.name)}`;
	// }

	private getValueName() {
		let res: string = null;
		forOwn(this.constructor, (it, key) => {
			if (it instanceof Enumeration && it.id === this.id && isNaN(+key)) {
				res = key;
				return false;
			}
		});
		return res;
	}
}

export abstract class FlagEnumeration<T extends FlagEnumeration<T>> extends Enumeration {
	static find(value: number): Enumeration {
		return this.findOrCreate(value, this);
	}

	private static findOrCreate(value: number, constructor: any) {
		return constructor[value] || new constructor(value);
	}

	readonly bunch: boolean;

	constructor(value: number | T[], displayName?: string) {
		let bunch = false;
		if (isArray(value)) {
			value = value.reduce((res, enm) => res |= +enm.valueOf(), 0);
			bunch = true;
		}
		super(value, displayName);
		this.bunch = bunch;
	}

	has(other: T) {
		if (other === undefined) return false;
		return (+this._value & +other.valueOf()) === other.valueOf();
	}

	combine(...other: T[]): T {
		const val = other.reduce((acc, it) => acc |= +it.valueOf(), +this._value);
		return FlagEnumeration.findOrCreate(val, this.constructor);
	}

	remove(...other: T[]): T {
		const val = other.reduce((acc, it) => acc &= ~it.valueOf(), +this._value);
		return FlagEnumeration.findOrCreate(val, this.constructor);
	}
}
