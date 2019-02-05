import { trigger, transition, useAnimation, query, stagger, style } from '@angular/animations';
import { fadeIn, fadeOut } from 'ng-animate';
import { NORMAL } from './variables';

export const FADE_LIST = trigger('fadeList', [
	transition('* => *', [ // each time the binding value changes
		query(
			':leave',
			stagger(100, useAnimation(fadeOut, NORMAL)),
			{ optional: true }
		),
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
