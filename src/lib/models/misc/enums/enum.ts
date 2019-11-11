import { camelCase, lowerCase, forOwn, isNil, isNumber, isArray, upperFirst, kebabCase, isBoolean } from 'lodash-es';
import { lineMicrotask } from '@bp/shared/utils';

export abstract class Enumeration {
	private static _list: any[];
	private static isValue(v: any) { return isNumber(v) || isBoolean(v); }

	static list<T extends Enumeration>(): T[] {
		if (!this._list) {
			const list: T[] = [];
			forOwn(this, (it, key) => {
				if (it instanceof Enumeration && isNaN(+key) && this.shouldList(it))
					list.push(it as T);
			});
			this._list = list;
		}
		return this._list;
	}

	static find(value: number | string): Enumeration | null {
		return (<any>this)[value] || null;
	}

	static parse(data: any): Enumeration | null {
		if (isNil(data))
			return null;

		return data instanceof this.prototype.constructor
			? data as Enumeration
			: this.find(this.isValue(data) ? data : camelCase(data));
	}

	static parseStrict(data: any): Enumeration {
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

	name!: string;

	cssClass!: string;

	protected _value!: number | boolean | string;

	protected _displayName: string;

	private id = `enum_${Math.random().toString(36).substr(2, 8)}`;

	constructor(displayName?: string | null);
	constructor(value: number | boolean, displayName?: string);
	constructor(valueOrDisplayName?: number | boolean | string | null, displayName?: string) {
		// do not access the {name} property in the constructor because it is lazy initialized and required all static properties to be present
		if (Enumeration.isValue(valueOrDisplayName)) {
			this._value = valueOrDisplayName!.valueOf();
			(<any>this.constructor)[this._value.toString()] = this;
			this._displayName = displayName as string;

			// Schedule a microtask at the end of the current event loop
			// which means that the constructor will have all the enumerations attached to it by the time
			// the callback is fired and we are able to find by the id of the enum its name amidst the static properties
			// PS we can't use queryMicrotask since it fires the microtask after the dom is rendered.
			// and we need the enums to be inited before any components are rendered
			lineMicrotask(() => this.init());
		} else {
			this._displayName = valueOrDisplayName as string;

			// same as the comment above
			lineMicrotask(() => this.init({ valueSameAsName: true }));
		}
	}

	valueOf() {
		return this._value;
	}

	toString(): string | undefined {
		return this._value ? this._value.toString() : undefined;
	}

	toJSON() {
		return this._value;
	}

	private init({ valueSameAsName }: { valueSameAsName: boolean } = <any>{}) {
		this.name = this.getValueName();
		this.cssClass = this.getCssClass();
		this._displayName = this._displayName || upperFirst(lowerCase(this.name));

		if (valueSameAsName)
			this._value = this.name;
	}

	private getCssClass() {
		// TODO Angular CLI mangles the names of class constructors which is used for generating cssClass, check somewhere later
		// return `${kebabCase(this.constructor.name)}-${kebabCase(this.name)}`;
		return kebabCase(this.name);
	}

	private getValueName() {
		let res = '';
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
