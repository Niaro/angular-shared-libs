import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { FADE_IN_LIST } from '@bp/shared/animations';

import { PropertiesMetadata, Entity } from '../../../models';

export type ViewsSectionScheme<T> = [NonFunctionPropertyNames<T>, NonFunctionPropertyNames<T>?][];

@Component({
	selector: 'bp-property-metadata-views-section',
	templateUrl: './property-metadata-views-section.component.html',
	styleUrls: ['./property-metadata-views-section.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [FADE_IN_LIST]
})
export class PropertyMetadataViewsSectionComponent {

	@Input() entity!: Entity;

	@Input() metadata!: PropertiesMetadata;

	@Input() sectionScheme!: ViewsSectionScheme<any>;

	@Input() title!: string;

	@Input() hasSeparator!: boolean;

}
