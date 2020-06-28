import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SvgIconComponent } from './svg-icon.component';
import { SvgSharedIconsDefinitionsComponent } from './svg-shared-icons-definitions.component';

const EXPOSED = [
	SvgSharedIconsDefinitionsComponent,
	SvgIconComponent
];

@NgModule({
	imports: [ CommonModule ],
	declarations: EXPOSED,
	exports: EXPOSED
})
export class SharedFeaturesSvgIconsModule { }
