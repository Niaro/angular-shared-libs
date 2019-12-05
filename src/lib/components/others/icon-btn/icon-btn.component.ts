import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FADE } from '@bp/shared/animations';
import { isNumber } from 'lodash-es';

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

	@Input('disabled') _disabled!: boolean;

	get disabled() { return this._disabled || this.pending; }

	get inProgress() { return this.pending || isNumber(this.progress); }

	isNumber = isNumber;

}
