import { IVersion } from '@bp/shared/typings';

export class Version implements IVersion {

	readonly major: number;

	readonly minor: number;

	readonly patch: number;

	readonly release: string;

	readonly build: number;

	readonly releaseWithBuild: string;

	constructor({ release, build }: { release: string, build: number; }) {
		const [ major, minor, patch ] = release.split('.').map(v => +v);
		this.major = major;
		this.minor = minor;
		this.patch = patch;
		this.release = release;
		this.build = build;
		this.releaseWithBuild = `${ release }-build.${ build }`;
	}

}
