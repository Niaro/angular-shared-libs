export class Version {
	readonly major: number;
	readonly minor: number;
	readonly revision: number;

	constructor(private source: string) {
		const [major, minor, revision] = source.split('.').map(v => +v);
		this.major = major;
		this.minor = minor;
		this.revision = revision;
	}

	toString() {
		return this.source;
	}
}

export const constants = {
	version: new Version(require('../../../../package.json').version),
	mockKey: '028da7d8aff54072b08cc359e0a4c294'
};
