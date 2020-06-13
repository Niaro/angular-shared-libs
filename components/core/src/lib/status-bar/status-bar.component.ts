import { ChangeDetectionStrategy, Component, Host, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { Describable } from '@bp/shared/models/core';
import { Enumeration } from '@bp/shared/models/core/enum';
import { StatusBarContainerDirective } from './status-bar-container.directive';

type StatusPosition = 'top' | 'left';

@Component({
	selector: 'bp-status-bar',
	templateUrl: './status-bar.component.html',
	styleUrls: [ './status-bar.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBarComponent implements OnChanges {

	@Input('src') status!: Describable;

	@Input() position!: StatusPosition;

	constructor(
		@Host() private _container: StatusBarContainerDirective,
		private _renderer: Renderer2
	) { }

	ngOnChanges({ position, status }: SimpleChanges) {
		if (position) {
			this._renderer.removeClass(this._container.$host, this._getStatusBarClass(position.previousValue));
			this._renderer.addClass(this._container.$host, this._getStatusBarClass(position.currentValue));
		}

		if (status) {
			this._renderer.removeClass(this._container.$host, this._getStatusClass(status.previousValue));
			this._renderer.addClass(this._container.$host, this._getStatusClass(status.currentValue));
		}
	}

	private _getStatusClass(status: Enumeration) {
		return `status-${ status }`;
	}

	private _getStatusBarClass(position: StatusPosition) {
		return `status-bar-${ position }`;
	}
}
