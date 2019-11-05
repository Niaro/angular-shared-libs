import { Component, ChangeDetectionStrategy, Input, OnChanges, HostBinding, Optional } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { SLIDE } from '@bp/shared/animations';

import { IValidationErrors } from '../models';
import { ValidationErrorStrings } from '../validation-error-strings';

@Component({
	selector: 'bp-validation-error',
	templateUrl: './validation-error.component.html',
	styleUrls: ['./validation-error.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [SLIDE]
})
export class ValidationErrorComponent implements OnChanges {
	@Input('errors') errors!: IValidationErrors | null;

	@Input() animate = true;

	@HostBinding('class.mat-error') matError = true;

	error$!: Observable<string> | null;

	constructor(@Optional() private translate?: TranslateService) { }

	ngOnChanges() {
		if (this.errors)
			this.error$ = this.translate
				? this.translate.onLangChange.pipe(
					map(() => new ValidationErrorStrings(this.errors!, this.translate)[0])
				)
				: of(new ValidationErrorStrings(this.errors)[0]);
		else
			this.error$ = null;
	}
}
