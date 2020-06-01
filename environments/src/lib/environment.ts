import { IEnvironment } from '@bp/shared/typings';

import { environment as appEnvironment } from './environment.app';
import { constants } from './constants';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvironment = {

	name: 'dev',

	remoteServer: !window.location.host.includes('localhost'),

	get localServer() { return !this.remoteServer; },

	widgetUrl: 'http://localhost:4201',

	// widgetLoaderUrl: 'http://localhost:4201/embed/embed_cashier.js',
	widgetLoaderUrl: 'https://embed-stg.bridgerpay.com/cashier',

	// by putting this always as the last property in the object we allow overriding
	// of any environment specific property by the apps
	...appEnvironment,

	...constants
};
