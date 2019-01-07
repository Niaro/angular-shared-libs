import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LayoutFacade } from '../../state';
import { environment } from '@bp/environment';

@Component({
	selector: 'bp-toolbar',
	templateUrl: 'toolbar.component.html',
	styleUrls: ['./toolbar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
	get isNotProd() { return environment.name !== 'prod'; }

	constructor(public layout: LayoutFacade) {}
}
