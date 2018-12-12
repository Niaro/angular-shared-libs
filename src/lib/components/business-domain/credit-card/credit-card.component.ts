import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CreditCardType } from '@bp/shared/models';

@Component({
	selector: 'bp-credit-card',
	templateUrl: './credit-card.component.html',
	styleUrls: ['./credit-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditCardComponent {
	@Input() src: CreditCardType;
}
