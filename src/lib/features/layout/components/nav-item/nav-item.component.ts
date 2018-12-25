import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { LayoutFacade } from '../../state';

@Component({
	selector: 'bp-nav-item',
	templateUrl: 'nav-item.component.html',
	styleUrls: ['nav-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavItemComponent {
	@Input() icon: string;
	@Input() path: string | any[];
	@Output() navigate = new EventEmitter();

	constructor(public layout: LayoutFacade) {}
}
