import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FADE } from '@bp/shared/animations';
import { isNumber } from 'lodash-es';

@Component({
	selector: 'bp-pending-icon-btn',
	templateUrl: './pending-icon-btn.component.html',
	styleUrls: [ './pending-icon-btn.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ FADE ]
})
export class PendingIconBtnComponent {

	@Input() pending!: boolean | null;

	@Input() progress!: number | null;

	@Input() disabled!: boolean | null;

	get disabledOrPending() { return !!this.disabled || !!this.pending; }

	get inProgress() { return !!this.pending || isNumber(this.progress); }

	isNumber = isNumber;

}
