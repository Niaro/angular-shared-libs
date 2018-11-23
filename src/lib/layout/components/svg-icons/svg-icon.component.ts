import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'bp-svg-icon',
	templateUrl: './svg-icon.component.html',
	styleUrls: ['./svg-icon.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgIconComponent {
	@Input() name: String;
}
