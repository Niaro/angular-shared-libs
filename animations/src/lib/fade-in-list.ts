import { query, stagger, style, transition, trigger, useAnimation } from '@angular/animations';

import { fadeIn } from './fade';
import { NORMAL } from './variables';

export const FADE_IN_LIST = trigger('fadeInList', [
	transition('* => *', [ // each time the binding value changes
		query(
			':enter',
			[
				style({ opacity: 0 }),
				stagger(20, useAnimation(fadeIn, NORMAL))
			],
			{ optional: true }
		)
	])
]);
