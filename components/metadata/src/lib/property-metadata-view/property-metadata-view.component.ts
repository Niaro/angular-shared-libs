import {
	ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, Renderer2,
	SimpleChange, SimpleChanges
} from '@angular/core';

import { FieldViewType, PropertyMetadata, PropertyMetadataTable } from '@bp/shared/models/metadata';

@Component({
	selector: 'bp-property-metadata-view',
	templateUrl: './property-metadata-view.component.html',
	styleUrls: [ './property-metadata-view.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyMetadataViewComponent implements OnChanges {
	// tslint:disable-next-line: naming-convention
	FieldViewType = FieldViewType;

	@Input() label = true;

	@Input() compact = false;

	@Input() metadata!: PropertyMetadata;

	@Input() table?: PropertyMetadataTable | null;

	@Input() value: any;

	get isCompact() { return !!this.table || !!this.compact; }

	// @Input() color: ThemePalette;

	get booleanIcon() { return this.value ? 'check' : 'close'; }

	constructor(
		private _renderer: Renderer2,
		private _host: ElementRef
	) { }

	ngOnChanges({ metadata }: SimpleChanges) {
		metadata && this._setHostClass(metadata);
	}

	isInteger(value: number) {
		return Number.isInteger(value);
	}

	private _setHostClass({ previousValue: prev, currentValue: curr }: SimpleChange) {
		prev && this._renderer.removeClass(this._host.nativeElement, this._getHostClass(prev));
		curr && this._renderer.addClass(this._host.nativeElement, this._getHostClass(curr));
	}

	private _getHostClass(md: PropertyMetadata) {
		return `view-type-${ md.viewType.cssClass }`;
	}
}
