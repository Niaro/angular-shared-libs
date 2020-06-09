import { Version } from './version';

export const constants = {
	version: new Version(require('version.json'))
};
