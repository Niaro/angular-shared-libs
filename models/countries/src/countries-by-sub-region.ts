import { mapValues } from 'lodash-es';

import { Dictionary } from '@bp/shared/typings';

import { Countries } from './countries';
import { Country } from './country';
import { CountryCode } from './country-codes';

// source https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/all/all.csv

const countriesBySubregion = {
	'Northern Africa': [ 'DZ', 'EG', 'LY', 'MA', 'SD', 'TN', 'EH' ],
	'Middle Africa': [ 'AO', 'CM', 'CF', 'TD', 'CG', 'CD', 'GQ', 'GA', 'ST' ],
	'Western Africa': [
		'BJ', 'BF', 'CV', 'CI', 'GM', 'GH', 'GN', 'GW', 'LR', 'ML', 'MR',
		'NE', 'NG', 'SH', 'SN', 'SL', 'TG'
	],
	'Southern Africa': [ 'BW', 'SZ', 'LS', 'NA', 'ZA' ],
	'Eastern Africa': [
		'IO', 'BI', 'KM', 'DJ', 'ER', 'ET', 'TF', 'KE', 'MG', 'MW', 'MU',
		'YT', 'MZ', 'RE', 'RW', 'SC', 'SO', 'SS', 'TZ', 'UG', 'ZM', 'ZW'
	],
	Caribbean: [
		'AI', 'AG', 'AW', 'BS', 'BB', 'BQ', 'KY', 'CU', 'CW', 'DM', 'DO',
		'GD', 'GP', 'HT', 'JM', 'MQ', 'MS', 'PR', 'BL', 'KN', 'LC', 'MF',
		'VC', 'SX', 'TT', 'TC', 'VG', 'VI'
	],
	'South America': [
		'AR', 'BO', 'BV', 'BR', 'CL', 'CO', 'EC', 'FK', 'GF', 'GY', 'PY',
		'PE', 'GS', 'SR', 'UY', 'VE'
	],
	'Central America': [ 'BZ', 'CR', 'SV', 'GT', 'HN', 'MX', 'NI', 'PA' ],
	'Northern America': [ 'BM', 'CA', 'GL', 'PM', 'US' ],
	'Southern Asia': [ 'AF', 'BD', 'BT', 'IN', 'IR', 'MV', 'NP', 'PK', 'LK' ],
	'Western Asia': [
		'AM', 'AZ', 'BH', 'CY', 'GE', 'IQ', 'IL', 'JO', 'KW', 'LB', 'OM',
		'PS', 'QA', 'SA', 'SY', 'TR', 'AE', 'YE'
	],
	'South-eastern Asia': [ 'BN', 'KH', 'ID', 'LA', 'MY', 'MM', 'PH', 'SG', 'TH', 'TL', 'VN' ],
	'Eastern Asia': [ 'CN', 'HK', 'JP', 'KP', 'KR', 'MO', 'MN', 'TW' ],
	'Central Asia': [ 'KZ', 'KG', 'TJ', 'TM', 'UZ' ],
	'Northern Europe': [
		'AX', 'DK', 'EE', 'FO', 'FI', 'GG', 'IS', 'IE', 'IM', 'JE', 'LV',
		'LT', 'NO', 'SJ', 'SE', 'GB'
	],
	'Southern Europe': [
		'AL', 'AD', 'BA', 'HR', 'GI', 'GR', 'VA', 'IT', 'MT', 'ME', 'MK',
		'PT', 'SM', 'RS', 'SI', 'ES'
	],
	'Western Europe': [ 'AT', 'BE', 'FR', 'DE', 'LI', 'LU', 'MC', 'NL', 'CH' ],
	'Eastern Europe': [ 'BY', 'BG', 'CZ', 'HU', 'MD', 'PL', 'RO', 'RU', 'SK', 'UA' ],
	Polynesia: [ 'AS', 'CK', 'PF', 'NU', 'PN', 'WS', 'TK', 'TO', 'TV', 'WF' ],
	'Australia and New Zealand': [ 'AU', 'CX', 'CC', 'HM', 'NZ', 'NF' ],
	Melanesia: [ 'FJ', 'NC', 'PG', 'SB', 'VU' ],
	Micronesia: [ 'GU', 'KI', 'MH', 'FM', 'NR', 'MP', 'PW', 'UM' ]
};

export const COUNTRIES_BY_SUBREGION = <Dictionary<Country[]>> <any> mapValues(
	countriesBySubregion,
	countryCodes => countryCodes.map(v => Countries.findByCode(<CountryCode> v))
);
