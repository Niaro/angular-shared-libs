import {
	Component, Input, Output, HostBinding, ChangeDetectionStrategy, ElementRef, AfterViewInit,
	OnDestroy, ViewChild
} from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { SLIDE_RIGHT } from '@bp/shared/animations';
import { TextMaskConfig, TextMaskDirective, NumberMaskConfig } from '@bp/shared/directives';
import { isEmpty } from 'lodash-es';

@Component({
	selector: 'bp-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
	animations: [SLIDE_RIGHT],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: InputComponent,
		multi: true
	}]
})
export class InputComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
	@Input() value: string;
	input$ = new BehaviorSubject<string>('');
	@Output() valueChange = this.input$;
	@Input() placeholder: string;
	@Input() mask: TextMaskConfig;
	@Input() autocomplete: MatAutocomplete;
	@HostBinding('class.empty') get empty() { return !this.value; }

	autocompleteOrigin = { elementRef: this.host };

	@ViewChild(TextMaskDirective) maskDirective: TextMaskDirective;
	@ViewChild('el') input: ElementRef;
	get $input(): HTMLInputElement { return this.input && this.input.nativeElement; }

	private destroyed$ = new Subject();

	constructor(private host: ElementRef) { }

	ngAfterViewInit() {
		if (this.autocomplete)
			this.autocomplete
				.optionSelected
				.pipe(takeUntil(this.destroyed$))
				.subscribe((it: MatAutocompleteSelectedEvent) => this.update(it.option.value));
		else
			this.maskDirective.valueChange$
				.pipe(map(v => this.maskDirective.config instanceof NumberMaskConfig && !this.maskDirective.config.allowLeadingZeroes && !isEmpty(v)
					? +v
					: v
				))
				.subscribe(v => this.update(<any>v));

	}

	ngOnDestroy() {
		this.destroyed$.next();
	}

	/** `View -> model callback called when value changes` */
	onChange: (value: any) => void = () => { };

	/** `View -> model callback called when input has been touched` */
	onTouched = () => { };

	// #region Implementation of the ControlValueAccessor interface
	writeValue(value: any): void {
		Promise.resolve().then(() => this.autocomplete
			? this.$input.value = value
			: this.maskDirective.writeValue(value && value.toString())
		);
	}

	registerOnChange(fn: (value: any) => {}): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => {}): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.$input.disabled = isDisabled;
	}
	// #endregion Implementation of the ControlValueAccessor interface

	update(value: string) {
		if (value === this.value)
			return;

		this.value = value;
		this.input$.next(value);
		this.onChange(value);
	}
}
