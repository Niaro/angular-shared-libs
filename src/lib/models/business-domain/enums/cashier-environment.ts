import { Enumeration } from '../../misc/enums/enum';

export class CashierEnvironment extends Enumeration {
	// TODO change to http://localhost:4201/widget-loader/main.js after the repos merging
	static development = new CashierEnvironment('DEV', 'https://localhost:4203/embed/embed_cashier.js');
	static staging = new CashierEnvironment('STG', 'https://embed-stg.bridgerpay.com/cashier');
	static sandbox = new CashierEnvironment('SBX', 'https://embed-sandbox.bridgerpay.com/cashier');
	static production = new CashierEnvironment('PROD', 'https://embed.bridgerpay.com/cashier');

	constructor(displayName: string, public embedScriptSrc: string) {
		super(displayName);
	}
}
