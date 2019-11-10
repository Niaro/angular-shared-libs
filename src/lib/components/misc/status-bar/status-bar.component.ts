import { Component, ChangeDetectionStrategy, Input, Host, Renderer2, SimpleChanges, OnChanges } from '@angular/core';
import { Enumeration, Describable } from '@bp/shared/models';
import { StatusBarContainerDirective } from './status-bar-container.directive';

type StatusPosition = 'top' | 'left';

@Component({
	selector: 'bp-status-bar',
	templateUrl: './status-bar.component.html',
	styleUrls: ['./status-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBarComponent implements OnChanges {
	@Input('src') status!: Describable;
	@Input() position!: StatusPosition;

	constructor(@Host() private container: StatusBarContainerDirective, private renderer: Renderer2) { }

	ngOnChanges({ position, status }: SimpleChanges) {
		if (position) {
			this.renderer.removeClass(this.container.$host, this.getStatusBarClass(position.previousValue));
			this.renderer.addClass(this.container.$host, this.getStatusBarClass(position.currentValue));
		}

		if (status) {
			status.previousValue && this.renderer.removeClass(this.container.$host, this.getCssClass(status.previousValue));
			status.currentValue && this.renderer.addClass(this.container.$host, this.getCssClass(status.currentValue));
		}
	}

	private getCssClass(status: Enumeration) {
		return status.cssClass;
	}

	private getStatusBarClass(position: StatusPosition) {
		return `status-bar-${position}`;
	}
}
