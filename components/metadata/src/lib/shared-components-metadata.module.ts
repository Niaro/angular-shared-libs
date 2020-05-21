import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';

import { SharedComponentsCoreModule } from '@bp/shared/components/core';
import { SharedComponentsControlsModule } from '@bp/shared/components/controls';

import { SharedDirectivesModule } from '@bp/shared/directives';
import { PropertyMetadataControlComponent } from './property-metadata-control';
import { PropertyMetadataControlsSectionComponent } from './property-metadata-controls-section';
import { PropertyMetadataViewComponent } from './property-metadata-view';
import { PropertyMetadataViewsSectionComponent } from './property-metadata-views-section';
import { MatIconModule } from '@angular/material/icon';
import { SharedPipesModule } from '@bp/shared/pipes';

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
		SharedDirectivesModule
	],
	exports: EXPOSED_COMPONENTS,
	declarations: EXPOSED_COMPONENTS
})
export class SharedComponentsMetadataModule { }
