import { PaymentMethodType, CashierButtonMode, CashierTheme } from './enums';
import { Currency } from './currency';
import { CashierLanguage } from './cashier-languages';

export interface ICashierEmbeddedParameters {

	firstName: any;

	lastName: any;

	phone: any;

	address: any;

	email: any;

	city: any;

	country: any;

	state: any;

	zipCode: any;

	amount: any;

	amountLock: boolean | null;

	cashierKey: string | null;

	cashierToken: string | null;

	orderId: string | null;

	trackingId: string | null;

	affiliateId: string | null;

	platformId: string | null;

	ip: string | null;

	directPaymentMethod: PaymentMethodType | null;

	hideHeader: boolean | null;

	showFooter: boolean | null;

	currencyLock: boolean | null;

	showRedirectMessage: boolean | null;

	currency: Currency | null;

	buttonMode: CashierButtonMode | null;

	depositButtonText: string | null;

	theme: CashierTheme | null;

	language: CashierLanguage | null;

	// not exposed to merchants

	onlyCreditCardPaymentMethod?: boolean | null;

}
