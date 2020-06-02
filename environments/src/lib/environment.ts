import { IEnvironment } from '@bp/shared/typings';
import { constants } from './constants';
import { environment as appEnvironment } from './environment.app';


// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvironment = {

	name: 'dev',

	remoteServer: !window.location.host.includes('localhost'),

	get localServer() { return !this.remoteServer; },

	cashierUrl: 'http://localhost:4201',

	// cashierLoaderUrl: 'http://localhost:4201/embed/embed_cashier.js',
	cashierLoaderUrl: 'https://embed-stg.bridgerpay.com/cashier',

	// by putting this always as the last property in the object we allow overriding
	// of any environment specific property by the apps
	...appEnvironment,

	...constants
};
