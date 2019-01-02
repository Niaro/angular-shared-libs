import { Enumeration } from '../../misc';

export class VolumeConditionType extends Enumeration {
	static max = new VolumeConditionType();
	static min = new VolumeConditionType();
	static is = new VolumeConditionType();
	static above = new VolumeConditionType();
}

export class TransactionConditionType extends Enumeration {
	static equalTo = new TransactionConditionType();
	static greaterThan = new TransactionConditionType();
	static lowerThan = new TransactionConditionType();
	static between = new TransactionConditionType();
}

export class CardConditionType extends Enumeration {
	static bin = new CardConditionType();
	static brand = new CardConditionType();
	static level = new CardConditionType();
	static issuer = new CardConditionType();
}

export class BlockConditionType extends Enumeration {
	static volume = new BlockConditionType();
	static transaction = new BlockConditionType();
	static bin = new BlockConditionType();
	static ip = new BlockConditionType('IP');
	static country = new BlockConditionType();
}
