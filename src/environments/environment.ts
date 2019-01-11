import { IEnvironment } from './interface';
import { environment as appEnvironment } from './environment.app';
import { IS_HMR_MODE } from './hmr';
import { constants } from './constants';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvironment = {
	name: 'dev',
	prod: false,
	get dev() { return !this.prod; },
	hmr: IS_HMR_MODE,
	api: {
		url: 'https://37efb36f-87de-42a0-89a3-f2d2a0c46d61.mock.pstmn.io',
		version: 'v1',
	},
	cashierWidgetUrl: 'http://localhost:4201/embed/embed_cashier.js',

	// by putting this always as the last property in the object we allow overriding of any environment specific property by the apps
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
