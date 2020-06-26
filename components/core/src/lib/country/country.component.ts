import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Countries, Country, CountryCode } from '@bp/shared/models/countries';

@Component({
	selector: 'bp-country',
	templateUrl: './country.component.html',
	styleUrls: [ './country.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryComponent implements OnChanges {

	@Input() src!: CountryCode | Country;

	@Input() compact!: boolean | string;

	@Input() hideTooltip!: boolean | string;

	@Input() round!: boolean | string;

	country!: Country | null;

	isWorldwide = false;

	ngOnChanges({ compact, src, hideTooltip, round }: SimpleChanges) {
		if (src) {
			this.country = this.src instanceof Country
				? this.src
				: Countries.findByCode(<CountryCode> this.src);
			this.isWorldwide = this.country === Countries.worldwide;
		}

		if (compact)
			this.compact = this.compact === '' ? true : this.compact;

		if (hideTooltip)
			this.hideTooltip = this.hideTooltip === '' ? true : this.hideTooltip;

		if (round)
			this.round = this.round === '' ? true : this.round;
	}
}
