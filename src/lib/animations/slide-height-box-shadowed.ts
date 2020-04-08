import { animation, style, animate, trigger, transition, useAnimation, query } from '@angular/animations';

import { NORMAL } from './variables';

const slidBoxShadowedUp = {
	height: 0,
	overflow: 'hidden',
};
export const BOX_SHADOWED_SLIDE_DOWN_ANIMATION = animation(
	[
		style(slidBoxShadowedUp),
		animate(
			'{{timing}}s {{ease}}',
			style({ height: '*' })
		),
	],
	NORMAL
);

export const BOX_SHADOWED_SLIDE_UP_ANIMATION = animation(
	animate('{{timing}}s {{ease}}', style(slidBoxShadowedUp)),
	NORMAL
);

export const BOX_SHADOWED_SLIDE = trigger('slideBoxShadowed', [
	transition(':enter', [
		query(
			'.animation-target',
			useAnimation(BOX_SHADOWED_SLIDE_DOWN_ANIMATION),
			{ optional: true }
		)
	]),
	transition(':leave', [
		query(
			'.animation-target',
			useAnimation(BOX_SHADOWED_SLIDE_UP_ANIMATION),
			{ optional: true }
		)
	]),
]);
