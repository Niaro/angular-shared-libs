import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { SvgIconsModule } from '../svg-icons';

import { ModalComponent } from './modal.component';
import { ModalOutletComponent } from './modal-outlet.component';
import { ModalService } from './modal.service';

const EXPOSED = [
	ModalComponent,
	ModalOutletComponent
];

@NgModule({
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		SvgIconsModule,
	],
	declarations: EXPOSED,
	exports: EXPOSED
})
export class ModalModule {
	static forRoot(): ModuleWithProviders<ModalModule> {
		return {
			ngModule: ModalModule,
			providers: [ModalService]
		};
	}
}
