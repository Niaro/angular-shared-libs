import { Enumeration } from '@bp/shared/models/core/enum';

export class TransactionStatus extends Enumeration {

	static init = new TransactionStatus();

	static approved = new TransactionStatus();

	static approvedOnHold = new TransactionStatus();

	static authorized = new TransactionStatus();

	static inProcess = new TransactionStatus();

	static pending = new TransactionStatus();

	static declined = new TransactionStatus();

	static declinedDueTo3DAuthFailure = new TransactionStatus();

	static declinedDoNotTryAgain = new TransactionStatus();

	static declinedByTimeout = new TransactionStatus();

	static declinedDueToInvalidCreditCard = new TransactionStatus();

	static declinedDueToInvalidData = new TransactionStatus();

	static refunded = new TransactionStatus();

	static partlyRefunded = new TransactionStatus();

	static chargeback = new TransactionStatus();

	get isDeclinedLike() { return this.name.startsWith(TransactionStatus.declined.name); }

}
