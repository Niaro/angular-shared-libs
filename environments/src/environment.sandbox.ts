import { IEnvironment } from '@bp/shared/typings';
import { constants } from './constants';
import { environment as appEnvironment } from './environment.app';

export const environment: IEnvironment = {

	name: 'sandbox',

	remoteServer: true,

	get localServer() { return !this.remoteServer; },

	cashierLoaderUrl: 'https://embed-sandbox.bridgerpay.com/cashier',

	...appEnvironment,

	...constants

};
