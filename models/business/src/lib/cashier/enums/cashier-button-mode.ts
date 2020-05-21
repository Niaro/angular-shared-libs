import { Enumeration } from '@bp/shared/models/core';

export class CashierButtonMode extends Enumeration {
	static modal = new CashierButtonMode();
	static tab = new CashierButtonMode();
	static spot = new CashierButtonMode();
}
