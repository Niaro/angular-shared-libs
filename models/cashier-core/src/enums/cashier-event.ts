import { Enumeration } from '@bp/shared/models/core/enum';

export class CashierEvent extends Enumeration {

	static clickOnPaymentMethod = new CashierEvent();

	static deposit = new CashierEvent();

	static contentRendered = new CashierEvent();

	static redirect = new CashierEvent();

	static reload = new CashierEvent();

	static closeModal = new CashierEvent();

	static init = new CashierEvent();

}
