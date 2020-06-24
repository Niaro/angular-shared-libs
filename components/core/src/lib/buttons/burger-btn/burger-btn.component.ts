import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
	selector: 'bp-burger-btn',
	templateUrl: './burger-btn.component.html',
	styleUrls: [ './burger-btn.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BurgerBtnComponent {
	@Input() @HostBinding('class.cross') showCross!: boolean;
}
