import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IApiErrorMessage } from '@bp/shared/models/common';

@Component({
	selector: 'bp-api-errors',
	templateUrl: './api-errors.component.html',
	styleUrls: [ './api-errors.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiErrorsComponent {

	@Input('src')
	errors!: IApiErrorMessage[];

	@Input() showType = true;

}
