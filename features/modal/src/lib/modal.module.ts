import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { SharedFeaturesSvgIconsModule } from '@bp/shared/features/svg-icons';

import { ModalComponent } from './modal.component';
import { ModalOutletComponent } from './modal-outlet.component';

const EXPOSED = [
	ModalComponent,
	ModalOutletComponent
];

@NgModule({
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		SharedFeaturesSvgIconsModule,
	],
	declarations: EXPOSED,
	exports: EXPOSED
})
export class SharedFeaturesModalModule { }
