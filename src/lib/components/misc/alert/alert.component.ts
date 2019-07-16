import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { SLIDE } from '@bp/shared/animations';
import { IApiErrorMessage } from '@bp/shared/models';
import { isEmpty } from 'lodash-es';

@Component({
	selector: 'bp-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
	animations: [SLIDE],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
	@Input() type: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' = 'primary';
	@Input() errors: IApiErrorMessage[] | null;
	@Input() messages: string[] | null;
	@Input() closable = true;

	@HostBinding('class.hidden') get hidden() { return isEmpty(this.errors) && isEmpty(this.messages); }
}
