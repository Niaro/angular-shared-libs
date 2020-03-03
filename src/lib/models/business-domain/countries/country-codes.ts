import { getCountries } from 'libphonenumber-js';

export type CountryCode = typeof COUNTRY_CODES[ number ];

export const COUNTRY_CODES = <const>[
	...getCountries(),
	'ALL', 'AQ', 'BV', 'GS', 'HM', 'PN', 'TF', 'UM'
];
