import { IVersion } from '@bp/shared/typings';

export class Version implements IVersion {

	readonly major: number;

	readonly minor: number;

	readonly patch: number;

	readonly release: string;

	readonly prerelease: string;

	constructor({ release, prerelease }: { release: string, prerelease: string; }) {
		const [ major, minor, patch ] = release.split('.').map(v => +v);
		this.major = major;
		this.minor = minor;
		this.patch = patch;
		this.release = release;
		this.prerelease = prerelease;
	}
}
