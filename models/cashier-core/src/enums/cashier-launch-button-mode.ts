import { Enumeration } from '@bp/shared/models/core/enum';

export class CashierLaunchButtonMode extends Enumeration {

	static modal = new CashierLaunchButtonMode();

	static tab = new CashierLaunchButtonMode();

	static spot = new CashierLaunchButtonMode();

}
