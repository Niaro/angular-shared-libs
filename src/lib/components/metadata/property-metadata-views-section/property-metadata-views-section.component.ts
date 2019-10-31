import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { FADE_IN_LIST } from '@bp/shared/animations';

import { PropertiesMetadata } from '../../../models';

@Component({
	selector: 'bp-property-metadata-views-section',
	templateUrl: './property-metadata-views-section.component.html',
	styleUrls: ['./property-metadata-views-section.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [FADE_IN_LIST]
})
export class PropertyMetadataViewsSectionComponent {
	@Input() model!: any;

	@Input() metadata!: PropertiesMetadata;

	@Input() propertyMetadataNameGroups!: [string, string?][];

	@Input() title!: string;

	@Input() hasSeparator!: boolean;
}
