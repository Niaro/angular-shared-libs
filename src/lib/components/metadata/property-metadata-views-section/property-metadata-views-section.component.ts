import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { FADE_IN_LIST } from '@bp/shared/animations';

import { ClassMetadata, Entity } from '../../../models';
import { get } from 'lodash-es';

export type ViewsSectionScheme<T> = [ NonFunctionPropertyNames<T>, NonFunctionPropertyNames<T>?][];

@Component({
	selector: 'bp-property-metadata-views-section',
	templateUrl: './property-metadata-views-section.component.html',
	styleUrls: [ './property-metadata-views-section.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ FADE_IN_LIST ]
})
export class PropertyMetadataViewsSectionComponent {

	@Input() entity!: Entity;

	@Input() metadata!: ClassMetadata;

	@Input() sectionScheme!: ViewsSectionScheme<any>;

	@Input() title!: string;

	@Input() hasSeparator!: boolean;

	get = get;

	meta(prop: string) {
		const md = this.metadata.get<any>(prop);
		if (!md)
			console.warn(`${ prop } doesn't have metadata on ${ this.entity?.constructor.name }`);
		return md;
	}
}
