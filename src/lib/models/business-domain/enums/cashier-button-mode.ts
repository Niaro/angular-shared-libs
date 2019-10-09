import { Enumeration } from '../../misc/enum';

export class CashierButtonMode extends Enumeration {
	static modal = new CashierButtonMode();
	static tab = new CashierButtonMode();
	static spot = new CashierButtonMode();
}
