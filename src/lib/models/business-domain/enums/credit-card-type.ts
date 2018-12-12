import { Enumeration } from '../../misc';

export class CreditCardType extends Enumeration {
	static maestro = new CreditCardType();
	static hipercard = new CreditCardType();
	static elo = new CreditCardType();
	static alipay = new CreditCardType();
	static forbrugsforeningen = new CreditCardType();
	static dankort = new CreditCardType();
	static visa = new CreditCardType();
	static masterCard = new CreditCardType('MasterCard');
	static amex = new CreditCardType();
	static diners = new CreditCardType();
	static discover = new CreditCardType();
	static unionpay = new CreditCardType();
	static jcb = new CreditCardType();
}
