import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { isNumber } from 'lodash-es';

import { FADE } from '@bp/shared/animations';

@Component({
	selector: 'bp-icon-btn',
	templateUrl: './icon-btn.component.html',
	styleUrls: ['./icon-btn.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [FADE]
})
export class IconBtnComponent {

	@Input() pending!: boolean;

	@Input() progress!: number;

	@Input() disabled!: boolean;

	get disabledOrPending() { return this.disabled || this.pending; }

	get inProgress() { return this.pending || isNumber(this.progress); }

	isNumber = isNumber;

}
