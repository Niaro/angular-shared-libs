import { Component, Input, Output, HostBinding, ChangeDetectionStrategy, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { BehaviorSubject, Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';

import { SLIDE_RIGHT } from '@bp/shared/animations';

@Component({
	selector: 'bp-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
	animations: [SLIDE_RIGHT],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements OnInit, OnDestroy {
	@Input() value: string;
	@Input() placeholder: string;
	@Input() autocomplete: MatAutocomplete;
	@HostBinding('class.empty') get empty() { return !this.value; }

	input$ = new BehaviorSubject<string>('');

	@Output() valueChange = this.input$.pipe(auditTime(400));
	autocompleteOrigin = { elementRef: this.host };

	private destroyed$ = new Subject();

	constructor(private host: ElementRef) { }

	ngOnInit() {
		if (this.autocomplete)
			this.autocomplete
				.optionSelected
				.pipe(takeUntil(this.destroyed$))
				.subscribe((it: MatAutocompleteSelectedEvent) => this.update(it.option.value));
	}

	ngOnDestroy() {
		this.destroyed$.next();
	}

	update(value: string) {
		if (value === this.value)
			return;

		this.value = value;
		this.input$.next(value);
	}
}
