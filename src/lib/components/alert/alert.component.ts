import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SLIDE } from '../../utils';
import { ResponseError } from '../../models';

@Component({
	selector: 'bp-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
	animations: [SLIDE],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
	@Input() type: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' = 'primary';
	@Input() show = true;
	@Input() error: ResponseError;
}
