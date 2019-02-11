import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'bp-svg-shared-icons-definitions',
	templateUrl: './svg-shared-icons-definitions.component.html',
	styles: [':host { display: none }'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgSharedIconsDefinitionsComponent {}
