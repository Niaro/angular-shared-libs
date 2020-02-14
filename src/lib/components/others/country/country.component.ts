import { Component, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { Country, CountryCode, Countries } from '../../../models';

@Component({
	selector: 'bp-country',
	templateUrl: './country.component.html',
	styleUrls: [ './country.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryComponent implements OnChanges {
	@Input() src!: CountryCode | Country;

	@Input() compact!: boolean;

	@Input() hideTooltip!: boolean;

	@Input() round!: boolean;

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
			this.compact = <any> this.compact === '' ? true : this.compact;

		if (hideTooltip)
			this.hideTooltip = <any> this.hideTooltip === '' ? true : this.hideTooltip;

		if (round)
			this.round = <any> this.round === '' ? true : this.round;
	}
}
