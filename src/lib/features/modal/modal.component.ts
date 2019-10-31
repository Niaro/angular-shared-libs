import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';

@Component({
	selector: 'bp-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
	@ViewChild(TemplateRef, { static: true }) template!: TemplateRef<any>;
}
