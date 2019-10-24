import { Enumeration } from '../../misc/enums/enum';

export class CashierEnvironment extends Enumeration {
	// TODO change to http://localhost:4201/widget-loader/main.js after the repos merging
	static development = new CashierEnvironment('https://localhost:4201/embed/embed_cashier.js');
	static staging = new CashierEnvironment('https://embed-stg.bridgerpay.com/cashier');
	static sandbox = new CashierEnvironment('https://embed-sandbox.bridgerpay.com/cashier');
	static production = new CashierEnvironment('https://embed.bridgerpay.com/cashier');

	constructor(public embedScriptSrc: string) {
		super();
	}
}
