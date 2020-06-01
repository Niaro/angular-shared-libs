import { Enumeration } from '@bp/shared/models/core';

export class CashierTheme extends Enumeration {

	static dark = new CashierTheme();

	static light = new CashierTheme();

	static admin = new CashierTheme();

	static transparent = new CashierTheme();

}
