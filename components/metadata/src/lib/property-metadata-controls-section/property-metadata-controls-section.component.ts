import { isNil } from 'lodash-es';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { FADE_IN, FADE_IN_LIST } from '@bp/shared/animations';
import { ClassMetadata } from '@bp/shared/models/metadata';
import { Dictionary, NonFunctionPropertyNames } from '@bp/shared/typings';

export type ControlsSectionScheme<T> = [ NonFunctionPropertyNames<T>, (NonFunctionPropertyNames<T> | 'stub')?][];

@Component({
	selector: 'bp-property-metadata-controls-section',
	templateUrl: './property-metadata-controls-section.component.html',
	styleUrls: [ './property-metadata-controls-section.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ FADE_IN_LIST, FADE_IN ]
})
export class PropertyMetadataControlsSectionComponent {

	isNil = isNil;

	@Input() form!: FormGroup;

	@Input() metadata!: ClassMetadata;

	@Input() sectionScheme!: ControlsSectionScheme<any>;

	@Input() title!: string;

	@Input() hasSeparator!: boolean;

	get controls() { return <Dictionary<FormControl>> this.form.controls; }

	isFadeInAnimationComplete = false;

	meta(prop?: string) {
		if (!prop)
			throw new Error('The property name must be provided');

		return this.metadata.get<any>(prop);
	}

}
