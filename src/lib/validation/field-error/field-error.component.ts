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
	@Input('bpFieldError') formControlName: string;

	get ngControl() { return this.formField._control && this.formField._control.ngControl; }

	errors$ = new OptionalBehaviorSubject<Dictionary<any>>();

	controlName$ = new OptionalBehaviorSubject<string>();

	constructor(private formField: MatFormField) { }

	ngOnChanges({ formControlName }: SimpleChanges) {
		formControlName && this.controlName$.next(this.formControlName);
	}

	ngAfterViewInit() {
		this.ngControl.statusChanges
			.subscribe(() => this.errors$.next(this.ngControl.errors));

		!this.formControlName && this.controlName$.next(this.ngControl.name);
	}
}
