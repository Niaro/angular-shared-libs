import { Component, ChangeDetectionStrategy, Input, Host, Renderer2, SimpleChanges, OnChanges } from '@angular/core';
import { Enumeration } from '@bp/shared/models';
import { StatusBarContainerDirective } from './status-bar-container.directive';

type StatusPosition = 'top' | 'left';

@Component({
	selector: 'bp-status-bar',
	templateUrl: './status-bar.component.html',
	styleUrls: ['./status-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBarComponent implements OnChanges {
	@Input('src') status: Enumeration;
	@Input() position: StatusPosition;

	constructor(@Host() private container: StatusBarContainerDirective, private renderer: Renderer2) { }

	ngOnChanges({ position, status }: SimpleChanges) {
		if (position) {
			this.renderer.removeClass(this.container.$host, this.getStatusBarClass(position.previousValue));
			this.renderer.addClass(this.container.$host, this.getStatusBarClass(position.currentValue));
		}

		if (status) {
			this.renderer.removeClass(this.container.$host, this.getStatusClass(status.previousValue));
			this.renderer.addClass(this.container.$host, this.getStatusClass(status.currentValue));
		}
	}

	private getStatusClass(status: Enumeration) {
		return `status-${status}`;
	}

	private getStatusBarClass(position: StatusPosition) {
		return `status-bar-${position}`;
	}
}
