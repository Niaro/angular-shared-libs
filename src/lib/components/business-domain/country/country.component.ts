import { Component, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { Country } from '@bp/shared/models';

@Component({
	selector: 'bp-country',
	templateUrl: './country.component.html',
	styleUrls: ['./country.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryComponent implements OnChanges {
	@Input('src') country: Country;
	@Input() compact: boolean;

	ngOnChanges({ compact }: SimpleChanges) {
		if (compact)
			this.compact = true;
	}
}
