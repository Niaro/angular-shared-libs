import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgSharedIconsDefinitionsComponent } from './svg-shared-icons-definitions.component';
import { SvgIconComponent } from './svg-icon.component';

const EXPOSED = [
	SvgSharedIconsDefinitionsComponent,
	SvgIconComponent
];

@NgModule({
	imports: [
		CommonModule
	],
	declarations: EXPOSED,
	exports: EXPOSED
})
export class SvgIconsModule { }
