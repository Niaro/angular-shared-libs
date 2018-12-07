import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'bp-svg-icon-definitions',
	templateUrl: './svg-icon-definitions.component.html',
	styles: [':host { display: none }'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconDefinitionsComponent {}
