import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EnvironmentService } from '@bp/shared/services';

@Component({
	selector: 'bp-version',
	templateUrl: './version.component.html',
	styleUrls: [ './version.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionComponent {

	constructor(public env: EnvironmentService) { }

}
