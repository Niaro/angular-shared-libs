import { Component, Output, EventEmitter } from '@angular/core';
import { LayoutFacade } from '../../state';

@Component({
	selector: 'bp-toolbar',
	templateUrl: 'toolbar.component.html',
	styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
	constructor(public layout: LayoutFacade) {}
}
