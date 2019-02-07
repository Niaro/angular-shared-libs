import { trigger, transition, useAnimation, query, stagger, style } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { NORMAL } from './variables';

export const FADE_IN_LIST = trigger('fadeInList', [
	transition('* => *', [ // each time the binding value changes
		query(
			':enter',
			[
				style({ opacity: 0 }),
				stagger(100, useAnimation(fadeIn, NORMAL))
			],
			{ optional: true }
		)
	])
]);
