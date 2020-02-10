export class Version {

	readonly major: number;

	readonly minor: number;

	readonly patch: number;

	readonly release: string;

	readonly prerelease: string;

	constructor({ release, prerelease }: { release: string, prerelease: string }) {
		const [major, minor, patch] = release.split('.').map(v => +v);
		this.major = major;
		this.minor = minor;
		this.patch = patch;
		this.release = release;
		this.prerelease = prerelease;
	}
}

export const constants = {
	version: new Version(require('../../../../version.json')),
	mockUrl: 'https://37efb36f-87de-42a0-89a3-f2d2a0c46d61.mock.pstmn.io',
	mockKey: '028da7d8aff54072b08cc359e0a4c294'
};
