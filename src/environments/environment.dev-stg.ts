import { IEnvironment } from './interface';
import { environment as appEnvironment } from './environment.app';
import { IS_HMR_MODE } from './hmr';
import { constants } from './constants';

export const environment: IEnvironment = {
	name: 'dev-stg',
	prod: false,
	get dev() { return !this.prod; },
	hmr: IS_HMR_MODE,
	api: {
		url: 'https://api-stg.bridgerpay.com',
		version: 'v1',
	},

	// by putting it always as the last property in the object we allow override any environment specific property by the apps
	...appEnvironment,
	...constants
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI;
