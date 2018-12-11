import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'bp-not-found-page',
	templateUrl: './not-found-page.component.html',
	styleUrls: ['../error-page/error-page.component.scss', './not-found-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPageComponent { }
