import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LayoutFacade } from '../../state';

@Component({
	selector: 'bp-sidenav',
	templateUrl: 'sidenav.component.html',
	styleUrls: ['sidenav.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
	constructor(public layout: LayoutFacade) {}
}
