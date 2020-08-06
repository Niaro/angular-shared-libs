import {
	camelCase, forIn, forOwn, isBoolean, isNil, isNumber, kebabCase,
	lowerCase, upperFirst
} from 'lodash-es';

// tslint:disable: static-this
// We use static this in this context because we want to use
// the inherited static this scope,
export abstract class Enumeration {

	private static _list: any[];

	private static _isValue(v: any) { return isNumber(v) || isBoolean(v); }

	static list<T extends Enumeration>(): T[] {
		if (!this._list) {
			const list: T[] = [];
			forIn(this, (it, key) => {
				if (it instanceof Enumeration && Number.isNaN(+key) && this._shouldList(it))
					list.push(<T> it);
			});
			this._list = list;
		}

		return this._list;
	}

	static find<T extends Enumeration>(value: number | string): T | null {
		return (<any> this)[ value ] || null;
	}

	static parse(data: any): Enumeration | null {
		if (isNil(data))
			return null;

		return data instanceof this.prototype.constructor
			? <Enumeration> data
			: this.find(this._isValue(data) ? data : camelCase(data));
	}

	static parseStrict(data: any): Enumeration {
		const result = this.parse(data);
		if (!result)
			throw new Error(`Enum type ${ this.name } does not contains value ${ data }`);

		return result;
	}

	static isInstance(value: any) { return value instanceof this; }

	protected static _shouldList(value: Enumeration) {
		return true;
	}

	get displayName(): string { return this._displayName || this.name; }

	get name() {
		return this.value?.toString() ?? '';
	}

	protected _value!: number | boolean | string;

	get value() {
		return this._value ?? (this._value = this._getValueName());
	}

	cssClass!: string;

	protected _displayName: string;

	private _id = `enum_${ this._getUniqId() }`;

	constructor(displayName?: string | null);
	constructor(value: number | boolean, displayName?: string);
	constructor(valueOrDisplayName?: number | boolean | string | null, displayName?: string) {
		// do not access the {name} property in the constructor because it is lazy initialized
		// and required all static properties to be present
		if (Enumeration._isValue(valueOrDisplayName)) {
			this._value = valueOrDisplayName!.valueOf();
			(<any> this.constructor)[ this._value.toString() ] = this;
			this._displayName = <string> displayName;
		} else
			this._displayName = <string> valueOrDisplayName;

		// Schedule a microtask at the end of the current event loop
		// which means that the constructor will have all the enumerations attached to it by the time
		// the callback is fired and we are able to find by the id of the enum its name amidst the static properties
		// PS we can't use queryMicrotask since it fires the microtask after the dom is rendered.
		// and we need the enums to be inited before any components are rendered
		Promise
			.resolve()
			.then(() => this._init());
	}

	valueOf() {
		return this.value;
	}

	toString(): string | undefined {
		return this.name;
	}

	toJSON() {
		return this.value;
	}

	protected _init() {
		this.cssClass = this._getCssClass();
		this._displayName = this._displayName ?? upperFirst(lowerCase(this.name));
	}

	private _getUniqId() {
		return Math
			.random()
			.toString(36)
			.substr(2, 8);
	}

	private _getCssClass() {
		// TODO Angular CLI mangles the names of class constructors which is used for generating cssClass, check
		// somewhere later
		// return `${kebabCase(this.constructor.name)}-${kebabCase(this.name)}`;
		return kebabCase(this.name);
	}

	private _getValueName() {
		let res = '';
		forOwn(this.constructor, (it, key) => {
			if (it instanceof Enumeration && it._id === this._id && Number.isNaN(+key)) {
				res = key;

				return false;
			}

			return true;
		});

		return res;
	}
}
