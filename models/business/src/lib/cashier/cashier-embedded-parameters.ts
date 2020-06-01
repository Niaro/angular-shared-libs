import { Currency } from '../currencies';
import { PaymentOptionType } from '../enums';
import { CashierLanguage } from './cashier-languages';
import { IClientDetails } from './client-details';
import { CashierButtonMode, CashierTheme } from './enums';

export interface ICashierEmbeddedParameters extends IClientDetails {

	amount: string | null;

	amountLock: boolean | null;

	cashierKey: string | null;

	cashierToken: string | null;

	orderId: string | null;

	trackingId: string | null;

	affiliateId: string | null;

	platformId: string | null;

	ip: string | null;

	directPaymentMethod: PaymentOptionType | null;

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
