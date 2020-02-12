import { isNumber, isBoolean, startCase, assign } from 'lodash-es';

export class GenerateSchemeControl {
	type: 'input' | 'textarea' | 'switch' | 'number';

	key: string;

	label: string;

	isRender = true;

	withinMatFormField = true;

	private _defaultValue: number | boolean | string;

	constructor({ key, value }: { key: string, value: number | boolean | string }) {
		this.key = key;
		this._defaultValue = value;
		this.isRender = ['payment_method_type', 'is_live', 'is3d_secure'].includes(key) ? false : true;
		this.label = startCase(key);
		this.type = this._getType();
		this.withinMatFormField = this.type !== 'switch';
	}

	private _getType() {
		if (isNumber(this._defaultValue))
			return 'number';
		if (isBoolean(this._defaultValue))
			return 'switch';
		if (['public_key'].includes(this.key))
			return 'textarea';
		return 'input';
	}
}

export class GenerateSchemeGroup {
	key!: string;

	isArray!: boolean;

	value!: GenerateSchemeControl | GenerateSchemeControl[];

	get isRender() { return this.isArray || (<GenerateSchemeControl>this.value).isRender; }

	constructor(data: DeepPartial<GenerateSchemeGroup>) {
		assign(this, data);
	}
}
