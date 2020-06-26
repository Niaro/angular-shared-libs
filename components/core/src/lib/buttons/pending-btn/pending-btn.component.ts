import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FADE } from '@bp/shared/animations';
import { isNumber } from 'lodash-es';

@Component({
	selector: 'bp-pending-btn',
	templateUrl: './pending-btn.component.html',
	styleUrls: [ './pending-btn.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ FADE ]
})
export class PendingBtnComponent {

	@Input() pending!: boolean | null;

	@Input() type = 'button';

	@Input() disabled!: boolean;

	@Input() progress!: number | null;

	@Input() btnClass!: string;

	get inProgress() { return !!this.pending || isNumber(this.progress); }

	isNumber = isNumber;
}
