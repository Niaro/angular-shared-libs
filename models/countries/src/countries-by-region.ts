import { Dictionary } from '@bp/shared/typings';
import { mapValues } from 'lodash-es';
import { Countries } from './countries';
import { Country } from './country';
import { CountryCode } from './country-codes';


const countryCodesByRegion = {
	'Africa': [
		'DZ', 'AO', 'BJ', 'BW', 'IO', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD',
		'CI', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'TF', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE',
		'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'YT', 'MA', 'MZ', 'NA', 'NE', 'NG',
		'RE', 'RW', 'SH', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN',
		'UG', 'EH', 'ZM', 'ZW'
	],
	'Americas': [
		'AI', 'AG', 'AR', 'AW', 'BS', 'BB', 'BZ', 'BM', 'BO', 'BQ', 'BV', 'BR', 'CA', 'KY',
		'CL', 'CO', 'CR', 'CU', 'CW', 'DM', 'DO', 'EC', 'SV', 'FK', 'GF', 'GL', 'GD', 'GP',
		'GT', 'GY', 'HT', 'HN', 'JM', 'MQ', 'MX', 'MS', 'NI', 'PA', 'PY', 'PE', 'PR', 'BL',
		'KN', 'LC', 'MF', 'PM', 'VC', 'SX', 'GS', 'SR', 'TT', 'TC', 'US', 'UY', 'VE', 'VG',
		'VI'
	],
	'Asia': [
		'AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'CY', 'GE', 'HK', 'IN', 'ID',
		'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KP', 'KR', 'KW', 'KG', 'LA', 'LB', 'MO', 'MY',
		'MV', 'MN', 'MM', 'NP', 'OM', 'PK', 'PS', 'PH', 'QA', 'SA', 'SG', 'LK', 'SY', 'TW',
		'TJ', 'TH', 'TL', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE'
	],
	'Europe': [
		'AX', 'AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CZ', 'DK', 'EE', 'FO', 'FI',
		'FR', 'DE', 'GI', 'GR', 'GG', 'VA', 'HU', 'IS', 'IE', 'IM', 'IT', 'JE', 'LV', 'LI',
		'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM',
		'RS', 'SK', 'SI', 'ES', 'SJ', 'SE', 'CH', 'UA', 'GB'
	],
	'Oceania': [
		'AS', 'AU', 'CX', 'CC', 'CK', 'FJ', 'PF', 'GU', 'HM', 'KI', 'MH', 'FM', 'NR', 'NC',
		'NZ', 'NU', 'NF', 'MP', 'PW', 'PG', 'PN', 'WS', 'SB', 'TK', 'TO', 'TV', 'UM', 'VU',
		'WF'
	]
};

export const COUNTRIES_BY_REGION = <Dictionary<Country[]>> <any> mapValues(
	countryCodesByRegion,
	countryCodes => countryCodes.map(v => Countries.findByCode(<CountryCode> v)!)
);
