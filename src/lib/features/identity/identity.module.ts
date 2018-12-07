import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { IdentityFacade } from './state';
import { IDENTITY_FEATURE_KEY, reducer, initialState } from './state/identity.reducer';
import { IdentityEffects } from './state/identity.effects';

@NgModule({
	imports: [
		CommonModule,
		StoreModule,
		EffectsModule,
	]
})
export class IdentityModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: IdentityModule,
			providers: [
				StoreModule.forFeature(IDENTITY_FEATURE_KEY, reducer, { initialState }).providers,
				EffectsModule.forFeature([IdentityEffects]).providers,
				IdentityFacade
			]
		};
	}
}
