import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { MaterialModule } from '../materials.module';
import {
	LayoutComponent, NavItemComponent, SidenavComponent, ToolbarComponent, SvgIconComponent,
	SvgIconDefinitionsComponent
} from './components';
import { LayoutFacade } from './state';
import { LAYOUT_FEATURE_KEY, reducer, initialState } from './state/layout.reducer';
import { LayoutEffects } from './state/layout.effects';

export const COMPONENTS = [
	LayoutComponent,
	NavItemComponent,
	SidenavComponent,
	ToolbarComponent,
	SvgIconComponent,
	SvgIconDefinitionsComponent
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MaterialModule,
		StoreModule.forFeature(LAYOUT_FEATURE_KEY, reducer, { initialState }),
		EffectsModule.forFeature([LayoutEffects]),
	],
	declarations: COMPONENTS,
	exports: COMPONENTS,
	providers: [LayoutFacade],
})
export class LayoutModule {}
