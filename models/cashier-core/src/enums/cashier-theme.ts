import { Enumeration } from '@bp/shared/models/core/enum';

export class CashierTheme extends Enumeration {

	static dark = new CashierTheme();

	static light = new CashierTheme();

	static admin = new CashierTheme();

	static transparent = new CashierTheme();

	protected _init() {
		super._init();
		this.cssClass = `${ this.name }-theme`;
	}
}
