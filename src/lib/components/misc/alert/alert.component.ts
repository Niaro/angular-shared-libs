import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { SLIDE } from '@bp/shared/animations';
import { IApiErrorMessage } from '@bp/shared/models';

@Component({
	selector: 'bp-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
	animations: [SLIDE],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
	@Input() type: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' = 'primary';
	@Input() show = false;
	@Input() errors: IApiErrorMessage[] | null;

	@HostBinding('class.hidden') get hidden() { return !this.errors && !this.show; }
}
