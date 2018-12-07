import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LayoutFacade } from '../../state';

@Component({
	selector: 'bp-toolbar',
	templateUrl: 'toolbar.component.html',
	styleUrls: ['./toolbar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
	constructor(public layout: LayoutFacade) {}
}
