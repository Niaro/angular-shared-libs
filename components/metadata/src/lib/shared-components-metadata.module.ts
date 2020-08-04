import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { SharedComponentsControlsModule } from '@bp/shared/components/controls';
import { SharedComponentsCoreModule } from '@bp/shared/components/core';
import { SharedDirectivesModule } from '@bp/shared/directives';
import { SharedFeaturesTooltipModule } from '@bp/shared/features/tooltip';
import { SharedPipesModule } from '@bp/shared/pipes';

import { PropertyMetadataControlComponent } from './property-metadata-control';
import { PropertyMetadataControlsSectionComponent } from './property-metadata-controls-section';
import { PropertyMetadataViewComponent } from './property-metadata-view';
import { PropertyMetadataViewsSectionComponent } from './property-metadata-views-section';

const EXPOSED_COMPONENTS = [
	PropertyMetadataControlComponent,
	PropertyMetadataControlsSectionComponent,
	PropertyMetadataViewComponent,
	PropertyMetadataViewsSectionComponent
];

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatSlideToggleModule,
		MatIconModule,
		MatChipsModule,

		SharedPipesModule,
		SharedComponentsCoreModule,
		SharedComponentsControlsModule,
		SharedDirectivesModule,
		SharedFeaturesTooltipModule
	],
	exports: EXPOSED_COMPONENTS,
	declarations: EXPOSED_COMPONENTS
})
export class SharedComponentsMetadataModule { }
