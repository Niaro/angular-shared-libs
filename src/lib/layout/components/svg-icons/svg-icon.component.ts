import { Component, Input } from '@angular/core';

@Component({
	selector: 'bp-svg-icon',
	templateUrl: './svg-icon.component.html',
	styleUrls: ['./svg-icon.component.scss'],
})
export class SvgIconComponent {
	@Input() name: String;
}
