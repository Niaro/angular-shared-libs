import { Component, ChangeDetectionStrategy, Input, ElementRef } from '@angular/core';
import { FADE } from '@bp/shared/animations';

@Component({
	selector: 'bp-pending-btn',
	templateUrl: './pending-btn.component.html',
	styleUrls: ['./pending-btn.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [FADE]
})
export class PendingBtnComponent {
	@Input() pending: boolean;
	@Input() type: string;
	@Input() disabled: boolean;
	@Input() btnClass: string;
	get $host() { return this.host.nativeElement; }

	constructor(public host: ElementRef) { }
}
