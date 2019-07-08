import { Component, ChangeDetectionStrategy, Input, ContentChild, TemplateRef } from '@angular/core';

@Component({
	selector: 'bp-alert-messages',
	templateUrl: './alert-messages.component.html',
	styleUrls: ['./alert-messages.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertMessagesComponent {
	@Input('src')
	messages: any[];

	@ContentChild(TemplateRef, { static: true }) tpl: TemplateRef<any>;
}
