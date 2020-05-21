import { NgModule, ModuleWithProviders } from '@angular/core';

import { UpperFirstPipe } from './upper-first.pipe';
import { IsPresentPipe } from './is-present.pipe';
import { MomentPipe } from './moment.pipe';
import { SafePipe } from './safe.pipe';
import { ToKeyValuePairsPipe } from './to-key-value-pairs.pipe';
import { ChunkPipe } from './chunk.pipe';
import { StartCasePipe } from './start-case.pipe';
import { TakePipe } from './take.pipe';
import { PropertiesMetadataColspanPipe } from './properties-metadata-colspan.pipe';
import { SumByPipe } from './sum-by.pipe';
import { BpCurrencyPipe } from './currency.pipe';

const EXPOSED = [
	UpperFirstPipe,
	IsPresentPipe,
	ToKeyValuePairsPipe,
	MomentPipe,
	SafePipe,
	ChunkPipe,
	StartCasePipe,
	TakePipe,
	PropertiesMetadataColspanPipe,
	BpCurrencyPipe,
	SumByPipe
];

@NgModule({
	exports: EXPOSED,
	declarations: EXPOSED
})
export class SharedPipesModule {

	static forRoot(): ModuleWithProviders<SharedPipesModule> {
		return {
			ngModule: SharedPipesModule,
			providers: [
				BpCurrencyPipe
			]
		};
	}

}
