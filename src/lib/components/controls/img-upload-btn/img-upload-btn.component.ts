import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener, Output, ChangeDetectorRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { isNumber } from 'lodash-es';

import { FirebaseService } from '@bp/shared/providers';
import { SLIDE, FADE } from '@bp/shared/animations';

import { ControlComponent } from '../control.component';

@Component({
	selector: 'bp-img-upload-btn',
	templateUrl: './img-upload-btn.component.html',
	styleUrls: ['./img-upload-btn.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [SLIDE, FADE],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: ImgUploadBtnComponent,
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: ImgUploadBtnComponent,
			multi: true
		}
	]
})
export class ImgUploadBtnComponent extends ControlComponent<string> implements OnInit {

	@Input() bucketPath!: string;

	@ViewChild('filePicker', { static: true }) filePickerRef!: ElementRef<HTMLInputElement>;

	@Output() readonly busy = new Subject();

	get filePicker() { return this.filePickerRef.nativeElement; }

	get file() { return this.filePicker.files && this.filePicker.files[0]; }

	isExceededAllowedSize = false;

	constructor(public firebase: FirebaseService, cdr: ChangeDetectorRef) {
		super(cdr);

		this.firebase.uploadProgress$
			.subscribe(v => this.busy.next(isNumber(v)));

		this.firebase.uploadedDownloadUrl$
			.subscribe(v => this.setValue(v));
	}

	ngOnInit() {
		fromEvent(this.filePicker, 'change')
			.subscribe(() => {
				this.isExceededAllowedSize = !!(this.file && (this.file.size > (15 * 1024 * 1024)));
				if (!this.isExceededAllowedSize && this.file)
					this.firebase.upload(this.file, this.bucketPath);
				this.cdr.detectChanges();
			});
	}

	validate() {
		return this.isExceededAllowedSize ? { exceededAllowedSize: true } : null;
	}

	@HostListener('click')
	onClick() {
		this.filePicker.click();
	}
}
