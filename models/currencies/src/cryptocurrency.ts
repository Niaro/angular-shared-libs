import { isString } from 'lodash-es';

import { MapIncomingValue, MetadataEntity } from '@bp/shared/models/metadata';

const CRYPTOS = new Map<CryptoCurrencyCode, CryptoCurrency>();

export class CryptoCurrency extends MetadataEntity {

	@MapIncomingValue()
	readonly logo!: string;

	@MapIncomingValue()
	readonly name!: string;

	@MapIncomingValue()
	readonly code!: CryptoCurrencyCode;

	constructor(dataOrCode: Partial<CryptoCurrency> | CryptoCurrencyCode) {
		super(isString(dataOrCode) ? { code: dataOrCode } : dataOrCode);

		if (CRYPTOS.has(this.code))
			return <CryptoCurrency> CRYPTOS.get(this.code);

		if (Cryptos[ this.code ]) {
			this.name = Cryptos[ this.code ];
			this.logo = `assets/images/cryptos/${ this.code }`;
		}

		CRYPTOS.set(this.code, this);

		Object.freeze(this);
	}

	toString(): any {
		return this.code;
	}

	valueOf(): any {
		return this.code;
	}

	toJSON() {
		return this.code;
	}
}

export type CryptoCurrencyCode = Exclude<keyof typeof Cryptos, 'prototype'>;

// tslint:disable: naming-convention
class Cryptos {
	static ADA = 'Cardano';
	static B2BX = 'B2BX';
	static BCH = 'Bitcoin Cash';
	static BNB = 'Binance';
	static BTC = 'Bitcoin';
	static DASH = 'DASH';
	static DOGE = 'Dogecoin';
	static ETH = 'Ethereum';
	static GUSD = 'Gemini Dollar';
	static IOST = 'IOSToken';
	static LTC = 'Litecoin';
	static NEM = 'NEM';
	static NEO = 'NEO';
	static OMG = 'OmiseGO';
	static PAX = 'Paxos Standard Token';
	static TUSD = 'TrueUSD';
	static USDC = 'USD Coin';
	static USDT = 'Tether';
	static VIU = 'Viuly';
	static XMR = 'Monero';
	static XRP = 'Ripple';
}
