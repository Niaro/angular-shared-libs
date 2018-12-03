import { Component, Input, Output, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { auditTime } from 'rxjs/operators';
import { SLIDE_RIGHT } from '../../utils';

@Component({
	selector: 'bp-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
	animations: [SLIDE_RIGHT],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {
	@Input() value: string;
	@Input() placeholder: string;
	@HostBinding('class.empty') get empty() { return !this.value; }

	input$ = new BehaviorSubject<string>('');

	@Output() valueChange = this.input$.pipe(auditTime(400));

	update(value: string) {
		if (value === this.value)
			return;

		this.value = value;
		this.input$.next(value);
	}
}
