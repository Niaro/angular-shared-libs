import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { isNumber } from 'lodash-es';

import { FADE } from '@bp/shared/animations';

@Component({
	selector: 'bp-pending-btn',
	templateUrl: './pending-btn.component.html',
	styleUrls: ['./pending-btn.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [FADE]
})
export class PendingBtnComponent {

	@Input() pending!: boolean;

	@Input() type = 'button';

	@Input() disabled!: boolean;

	@Input() progress!: number;

	@Input() btnClass!: string;

	get inProgress() { return this.pending || isNumber(this.progress); }

	isNumber = isNumber;
}
