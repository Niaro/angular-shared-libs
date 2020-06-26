import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedFeaturesSvgIconsModule } from '@bp/shared/features/svg-icons';

import { ModalOutletComponent } from './modal-outlet.component';
import { ModalComponent } from './modal.component';

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
