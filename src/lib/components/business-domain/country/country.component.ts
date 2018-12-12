import { Component, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { Country, CountryCode, Countries } from '@bp/shared/models';

@Component({
	selector: 'bp-country',
	templateUrl: './country.component.html',
	styleUrls: ['./country.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryComponent implements OnChanges {
	@Input() src: CountryCode | Country | 'ALL';
	@Input() compact: boolean;

	country: Country;
	isWorldwide = false;

	get name() { return this.isWorldwide ? 'worldwide' : this.country.name; }
	get klass() { return this.isWorldwide ? this.name : this.country.lowerCaseCode; }

	ngOnChanges({ compact, src }: SimpleChanges) {
		if (src) {
			this.country = this.src instanceof Country
				? this.src
				: Countries.findByCode(<CountryCode>this.src);
			this.isWorldwide = this.src === 'ALL';
			if (!this.isWorldwide && !this.country)
				throw new Error('The country code is not iso2 code');
		}

		if (compact)
			this.compact = true;
	}
}
