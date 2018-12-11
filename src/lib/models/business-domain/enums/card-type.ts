import { Enumeration } from '../../misc';

export class CardType extends Enumeration {
	static maestro = new CardType();
	static forbrugsforeningen = new CardType();
	static dankort = new CardType();
	static visa = new CardType();
	static masterCard = new CardType('MasterCard');
	static amex = new CardType();
	static dinersclub = new CardType();
	static discover = new CardType();
	static unionpay = new CardType();
	static jcb = new CardType();
}
