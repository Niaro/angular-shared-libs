import { IEnvironment } from '@bp/shared/typings';
import { constants } from './constants';
import { environment as appEnvironment } from './environment.app';

export const environment: IEnvironment = {

	name: 'stg',

	remoteServer: true,

	get localServer() { return !this.remoteServer; },

	cashierLoaderUrl: 'https://embed-stg.bridgerpay.com/cashier',

	...appEnvironment,

	...constants

};
