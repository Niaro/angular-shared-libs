import { Enumeration } from '../../misc/enums/enum';

export class CashierButtonMode extends Enumeration {
	static modal = new CashierButtonMode();
	static tab = new CashierButtonMode();
	static spot = new CashierButtonMode();
}
