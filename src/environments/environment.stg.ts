import { IEnvironment } from './interface';
import { IS_HMR_MODE } from './hmr';
import { environment as appEnvironment } from './environment.app';
import { constants } from './constants';

export const environment: IEnvironment = {
	name: 'stg',
	remoteServer: true,
	get localServer() { return !this.remoteServer; },
	hmr: IS_HMR_MODE,
	widgetLoaderUrl: 'https://embed-stg.bridgerpay.com/cashier',

	...appEnvironment,
	...constants
};
