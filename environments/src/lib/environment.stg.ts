import { IEnvironment } from '@bp/shared/typings';

import { environment as appEnvironment } from './environment.app';
import { constants } from './constants';

export const environment: IEnvironment = {

	name: 'stg',

	remoteServer: true,

	get localServer() { return !this.remoteServer; },

	widgetLoaderUrl: 'https://embed-stg.bridgerpay.com/cashier',

	...appEnvironment,

	...constants

};
