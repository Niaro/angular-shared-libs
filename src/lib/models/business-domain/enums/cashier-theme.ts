import { Enumeration } from '../../misc/enums/enum';

export class CashierTheme extends Enumeration {
	static dark = new CashierTheme();
	static light = new CashierTheme();
	static virtualTerminal = new CashierTheme();
}
