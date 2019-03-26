import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IApiErrorMessage } from '@bp/shared/models';

@Component({
	selector: 'bp-api-error',
	templateUrl: './api-error.component.html',
	styleUrls: ['./api-error.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiErrorComponent {

	@Input('src')
	errors: IApiErrorMessage[];
}
