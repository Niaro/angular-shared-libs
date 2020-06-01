import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { get } from 'lodash-es';

import { FADE_IN_LIST } from '@bp/shared/animations';
import { NonFunctionPropertyNames } from '@bp/shared/typings';
import { Entity, ClassMetadata, PropertyMetadata } from '@bp/shared/models/metadata';

export type ViewsSectionScheme<T> = [ NonFunctionPropertyNames<T>, NonFunctionPropertyNames<T>?][];

@Component({
	selector: 'bp-property-metadata-views-section',
	templateUrl: './property-metadata-views-section.component.html',
	styleUrls: [ './property-metadata-views-section.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ FADE_IN_LIST ]
})
export class PropertyMetadataViewsSectionComponent {

	@Input() entity!: Entity | null;

	@Input() metadata!: ClassMetadata;

	@Input() sectionScheme!: ViewsSectionScheme<any>;

	@Input() title!: string;

	@Input() hasSeparator!: boolean;

	get = get;

	meta(prop: string | undefined): PropertyMetadata {
		if (!prop)
			throw new Error('The property name must be provided');

		const md = this.metadata.get<any>(prop);
		if (!md)
			throw new Error(`${ prop } doesn't have metadata on ${ this.entity?.constructor.name }`);

		return md;
	}
}
