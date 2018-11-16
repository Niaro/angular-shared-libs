import { IEnvironment } from './interface';
import { IS_HMR_MODE } from './hmr';
import { environment as appEnvironment } from './environment.app';

export const environment: IEnvironment = {
	prod: true,
	hmr: IS_HMR_MODE,
	dev: false,
	api: {
		url: 'https://37efb36f-87de-42a0-89a3-f2d2a0c46d61.mock.pstmn.io/',
		version: 'v1',
	},
	...appEnvironment,
};
