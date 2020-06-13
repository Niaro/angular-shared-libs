import { Country, State } from '@bp/shared/models/countries';

export interface IClientDetails {
	firstName: string | null;

	lastName: string | null;

	phone: string | null;

	address: string | null;

	email: string | null;

	city: string | null;

	country: Country | null;

	state: State | null;

	zipCode: string | null;
}
