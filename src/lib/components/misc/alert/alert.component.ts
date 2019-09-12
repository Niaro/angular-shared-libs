import {
	Component, Input, ChangeDetectionStrategy, HostBinding, OnChanges,
	SimpleChanges
} from '@angular/core';
import { isEmpty } from 'lodash-es';
import { LocalStorageService } from 'angular-2-local-storage';
import * as m from 'moment';

import { SLIDE } from '@bp/shared/animations';
import { IApiErrorMessage } from '@bp/shared/models';

@Component({
	selector: 'bp-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
	animations: [SLIDE],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent implements OnChanges {
	@Input() type: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' = 'primary';

	@Input()
	get errors() { return this._errors; }
	set errors(value: IApiErrorMessage[] | null) { this._errors = value; }
	_errors!: IApiErrorMessage[] | null;

	@Input()
	get messages() { return this._messages; }
	set messages(value: string[] | null) { this._messages = value; }
	_messages!: string[] | null;

	@Input() closable = true;
	@Input() frequency: 'daily' | 'weekly' | 'always' = 'always';

	show = false;


	@HostBinding('class.hidden') get hidden() { return isEmpty(this._errors) && isEmpty(this._messages); }

	private get storageKey() { return JSON.stringify(this.errors || this.messages); }

	constructor(private localStorage: LocalStorageService) { }

	ngOnChanges({ errors, messages }: SimpleChanges) {
		if (errors || messages) {
			const hasContent = !!this.errors || !!this.messages;
			this.show = hasContent
				 ? this.frequency === 'always' || this.isCountdownComplete()
				 : false;
			this.clearContentIfHidden();
		}
	}

	clearContentIfHidden() {
		if (!this.show)
			this._errors = this._messages = null;
	}

	onClose() {
		this.show = false;
		this.localStorage.set(this.storageKey, m().toISOString());
	}

	private isCountdownComplete() {
		const shownDatetimeText: string | null = this.localStorage.get(this.storageKey);

		if (shownDatetimeText) {
			const shownDatetime = m(shownDatetimeText);
			const nextShowDatetime = shownDatetime.clone().add(this.frequency === 'daily' ? 1 : 7, 'days');
			return m().isSameOrAfter(nextShowDatetime);
		}

		return true;
	}
}
