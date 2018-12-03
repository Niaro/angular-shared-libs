export class User {
	userName: string;
	token: string;

	constructor(data: Partial<User>) {
		Object.assign(this, data);
	}
}
