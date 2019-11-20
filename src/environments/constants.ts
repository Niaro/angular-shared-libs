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
	version: new Version(require('../../../../cashier.json').version),
	mockUrl: 'https://37efb36f-87de-42a0-89a3-f2d2a0c46d61.mock.pstmn.io',
	mockKey: '028da7d8aff54072b08cc359e0a4c294'
};
