import { Enumeration } from '@bp/shared/models/core/enum';

export class CashierEnvironment extends Enumeration {

	// TODO change to http://localhost:4201/cashier-loader/main.js after the repos merging
	static development = new CashierEnvironment(
		'DEV',
		'https://localhost:4203/embed/embed_cashier.js',
		'https://api-stg.bridgerpay.com'
	);

	static staging = new CashierEnvironment(
		'STG',
		'https://embed-stg.bridgerpay.com/cashier',
		'https://api-stg.bridgerpay.com'
	);

	static sandbox = new CashierEnvironment(
		'SBX',
		'https://embed-sandbox.bridgerpay.com/cashier',
		'https://api-sandbox.bridgerpay.com'
	);

	static production = new CashierEnvironment(
		'PROD',
		'https://embed.bridgerpay.com/cashier',
		'https://api.bridgerpay.com'
	);

	constructor(
		displayName: string,
		// tslint:disable: parameter-properties
		public embedScriptSrc: string,
		public api: string
	) {
		super(displayName);
	}
}
