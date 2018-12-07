import { Component, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '@bp/environment';

@Component({
	selector: 'bp-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
	env = environment;
}
