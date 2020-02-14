import { IEnvironment } from './interface';
import { environment as appEnvironment } from './environment.app';
import { IS_HMR_MODE } from './hmr';
import { constants } from './constants';

export const environment: IEnvironment = {
	name: 'dev-stg',
	remoteServer: false,
	get localServer() { return !this.remoteServer; },
	hmr: IS_HMR_MODE,
	widgetLoaderUrl: 'https://embed-stg.bridgerpay.com/cashier',

	// by putting it always as the last property in the object we allow override any environment specific property by the apps
	...appEnvironment,
	...constants
};
