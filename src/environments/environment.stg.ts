import { IEnvironment } from './interface';
import { IS_HMR_MODE } from './hmr';
import { environment as appEnvironment } from './environment.app';
import { constants } from './constants';

export const environment: IEnvironment = {
	name: 'stg',
	prod: true,
	get dev() { return !this.prod; },
	hmr: IS_HMR_MODE,
	api: {
		url: 'https://37efb36f-87de-42a0-89a3-f2d2a0c46d61.mock.pstmn.io/',
		version: 'v1',
	},
	...appEnvironment,
	...constants
};
