import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
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
	@Input('disabled') _disabled!: boolean;

	get disabled() { return this._disabled || this.pending; }
}
