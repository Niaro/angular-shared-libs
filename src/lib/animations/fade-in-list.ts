import { trigger, transition, useAnimation, query, stagger, style } from '@angular/animations';

import { NORMAL } from './variables';
import { fadeIn } from './fade';

export const FADE_IN_LIST = trigger('fadeInList', [
	transition('* => *', [ // each time the binding value changes
		query(
			':enter',
			[
				style({ opacity: 0 }),
				stagger(50, useAnimation(fadeIn, NORMAL))
			],
			{ optional: true }
		)
	])
]);
