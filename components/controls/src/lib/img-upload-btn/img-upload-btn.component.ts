import { isNumber } from 'lodash-es';
import { fromEvent, Subject } from 'rxjs';

import {
	ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, Output,
	ViewChild
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FADE, SLIDE } from '@bp/shared/animations';
import { ControlComponent } from '@bp/shared/components/core';
import { FirebaseService } from '@bp/shared/services';

@Component({
	selector: 'bp-img-upload-btn',
	templateUrl: './img-upload-btn.component.html',
	styleUrls: [ './img-upload-btn.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [ SLIDE, FADE ],
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

	@Output('busy') readonly busy$ = new Subject();

	get filePicker() { return this.filePickerRef.nativeElement; }

	get file() { return this.filePicker.files && this.filePicker.files[ 0 ]; }

	isExceededAllowedSize = false;

	constructor(public firebase: FirebaseService, cdr: ChangeDetectorRef) {
		super(cdr);

		this.firebase.uploadProgress$
			.subscribe(v => this.busy$.next(isNumber(v)));

		this.firebase.uploadedDownloadUrl$
			.subscribe(v => this.setValue(v));
	}

	ngOnInit() {
		fromEvent(this.filePicker, 'change')
			.subscribe(() => {
				this.isExceededAllowedSize = !!(this.file && (this.file.size > (15 * 1024 * 1024)));
				if (!this.isExceededAllowedSize && this.file)
					this.firebase.upload(this.file, this.bucketPath);
				this._cdr.detectChanges();
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
