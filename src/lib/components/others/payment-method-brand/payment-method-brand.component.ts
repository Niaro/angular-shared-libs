import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';

import { PaymentMethodBrand } from '@bp/shared/models/business-domain/enums';

@Component({
	selector: 'bp-payment-method-brand',
	templateUrl: './payment-method-brand.component.html',
	styleUrls: ['./payment-method-brand.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentMethodBrandComponent implements OnChanges {
	@Input() src!: PaymentMethodBrand | string;

	brand!: PaymentMethodBrand | null;

	ngOnChanges() {
		this.brand = this.src instanceof PaymentMethodBrand
			? this.src
			: PaymentMethodBrand.parse(this.src);
	}
}
