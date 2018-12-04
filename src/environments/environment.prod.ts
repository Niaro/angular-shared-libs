import { IEnvironment } from './interface';
import { IS_HMR_MODE } from './hmr';
import { environment as appEnvironment } from './environment.app';
import { constants } from './constants';

export const environment: IEnvironment = {
	name: 'prod',
	prod: true,
	get dev() { return !this.prod; },
	hmr: IS_HMR_MODE,

	...appEnvironment,
	...constants
};
