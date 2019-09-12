import { Component, Input, OnChanges, AfterViewInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { OptionalBehaviorSubject } from '@bp/shared/rxjs';
import { Dictionary } from 'lodash';

// tslint:disable-next-line: prefer-on-push-component-change-detection
@Component({
	// tslint:disable-next-line:component-selector
	selector: '[bpFieldError]',
	templateUrl: './field-error.component.html',
	styleUrls: ['./field-error.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldErrorComponent implements OnChanges, AfterViewInit {
	@Input('bpFieldError') formControlName!: string;

	errors$ = new OptionalBehaviorSubject<Dictionary<any> | null>();

	controlName$ = new OptionalBehaviorSubject<string | null>();

	constructor(private formField: MatFormField) { }

	ngOnChanges({ formControlName }: SimpleChanges) {
		formControlName && this.controlName$.next(this.formControlName);
	}

	ngAfterViewInit() {
		const control = this.formField._control.ngControl;

		if (control) {
			control.statusChanges && control.statusChanges
				.subscribe(() => this.errors$.next(control.errors));

			!this.formControlName && this.controlName$.next(control.name);
		}
	}
}
