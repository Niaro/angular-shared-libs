import { Enumeration } from '../../misc';

export class TransactionStatus extends Enumeration {
	static approved = new TransactionStatus();
	static inProcess = new TransactionStatus();
	static pending = new TransactionStatus();
	static declined = new TransactionStatus();
	static declinedDueTo3DAuthFailure = new TransactionStatus();
	static declinedDoNotTryAgain = new TransactionStatus();
	static declinedByTimeout = new TransactionStatus();
	static declinedDueToInvalidCreditCard = new TransactionStatus();
	static refund = new TransactionStatus();
	static chargeback = new TransactionStatus();
}
