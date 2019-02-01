import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { MaterialModule } from '../../materials.module';

import {
	LayoutComponent, NavItemComponent, SidenavComponent, ToolbarComponent, SvgIconComponent,
	SvgIconDefinitionsComponent, FooterComponent, RightDrawerComponent, ModalComponent, ModalOutletComponent
} from './components';
import { LayoutFacade } from './state';
import { LAYOUT_FEATURE_KEY, reducer, initialState } from './state/layout.reducer';
import { LayoutEffects } from './state/layout.effects';

export const COMPONENTS = [
	LayoutComponent,
	NavItemComponent,
	SidenavComponent,
	RightDrawerComponent,
	ToolbarComponent,
	SvgIconComponent,
	SvgIconDefinitionsComponent,
	FooterComponent,
	ModalOutletComponent,
	ModalComponent
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MaterialModule,
		StoreModule,
		EffectsModule,
	],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class LayoutModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: LayoutModule,
			providers: [
				StoreModule.forFeature(LAYOUT_FEATURE_KEY, reducer, { initialState }).providers,
				EffectsModule.forFeature([LayoutEffects]).providers,
				LayoutFacade
			]
		};
	}
}
