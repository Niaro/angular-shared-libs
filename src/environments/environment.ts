import { IEnvironment } from './interface';
import { environment as appEnvironment } from './environment.app';
import { IS_HMR_MODE } from './hmr';
import { constants } from './constants';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvironment = {
	name: 'dev',
	remoteServer: false,
	get localServer() { return !this.remoteServer; },
	hmr: IS_HMR_MODE,
	api: {
		url: 'https://37efb36f-87de-42a0-89a3-f2d2a0c46d61.mock.pstmn.io',
		version: 'v1',
	},
	widgetUrl: 'http://localhost:4201',
	widgetLoaderUrl: 'http://localhost:4201/embed/embed_cashier.js',

	// by putting this always as the last property in the object we allow overriding
	// of any environment specific property by the apps
	...appEnvironment,
	...constants
};
