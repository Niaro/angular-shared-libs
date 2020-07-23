import { omit, pick } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, Optional } from '@angular/core';

import { SLIDE } from '@bp/shared/animations';

import { IValidationErrors } from '../models';
import { ValidationErrorStrings } from '../validation-error-strings';

@Component({
	selector: 'bp-validation-error',
	templateUrl: './validation-error.component.html',
	styleUrls: [ './validation-error.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ SLIDE ]
})
export class ValidationErrorComponent implements OnChanges {

	@Input('errors') errors!: IValidationErrors | null;

	@Input() animate = true;

	@HostBinding('class.mat-error') matError = true;

	error$!: Observable<string> | null;

	constructor(@Optional() private _translate?: TranslateService) { }

	ngOnChanges() {
		// tslint:disable-next-line: early-exit
		if (this.errors) {
			const errors = this._moveRequiredErrorToBottom(this.errors);
			this.error$ = this._translate
				? this._translate.onLangChange.pipe(
					map(() => new ValidationErrorStrings(errors!, this._translate)[ 0 ])
				)
				: of(new ValidationErrorStrings(errors)[ 0 ]);
		} else
			this.error$ = null;
	}

	private _moveRequiredErrorToBottom(errors: IValidationErrors): IValidationErrors {
		const requiredValidationRuleName = 'required';

		return <IValidationErrors> {
			...omit(this.errors, requiredValidationRuleName),
			...pick(this.errors, requiredValidationRuleName)
		};
	}
}
