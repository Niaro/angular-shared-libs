export interface IVersion {

	readonly major: number;

	readonly minor: number;

	readonly patch: number;

	readonly release: string;

	readonly build: number;

	readonly releaseWithBuild: string;

}
