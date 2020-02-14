import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FADE_IN_LIST, FADE_IN } from '@bp/shared/animations';

import { ClassMetadata } from '../../../models';

export type ControlsSectionScheme<T> = [ NonFunctionPropertyNames<T>, (NonFunctionPropertyNames<T> | 'stub')?][];

@Component({
	selector: 'bp-property-metadata-controls-section',
	templateUrl: './property-metadata-controls-section.component.html',
	styleUrls: [ './property-metadata-controls-section.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ FADE_IN_LIST, FADE_IN ]
})
export class PropertyMetadataControlsSectionComponent {

	@Input() form!: FormGroup;

	@Input() metadata!: ClassMetadata;

	@Input() sectionScheme!: ControlsSectionScheme<any>;

	@Input() title!: string;

	@Input() hasSeparator!: boolean;

	meta(prop: string) {
		return this.metadata.get<any>(prop);
	}

}
