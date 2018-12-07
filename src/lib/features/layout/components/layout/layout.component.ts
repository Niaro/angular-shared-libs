import { Component, ContentChild, ChangeDetectionStrategy } from '@angular/core';
import { SidenavComponent } from '../sidenav';
import { LayoutFacade } from '../../state';

@Component({
	selector: 'bp-layout',
	templateUrl: 'layout.component.html',
	styleUrls: ['layout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
	@ContentChild(SidenavComponent) sidenav: SidenavComponent;
	constructor(public layout: LayoutFacade) { }
}
