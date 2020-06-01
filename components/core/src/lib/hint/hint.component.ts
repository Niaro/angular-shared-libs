import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';

@Component({
	selector: 'bp-hint',
	templateUrl: './hint.component.html',
	styleUrls: [ './hint.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'class': 'material-icons-round'
	}
})
export class HintComponent {

	@Input() msg?: string;

	@HostBinding('class')
	@Input()
	size: 'lg' | 'md' | 'sm' = 'sm';

}
