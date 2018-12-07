import { trigger, transition, useAnimation } from '@angular/animations';

import { slideInUp, slideOutUp, slideInRight, slideOutRight } from 'ng-animate';

import { FAST } from './variables';

export const SLIDE_UP = trigger('slideUp', [
	transition(':enter', useAnimation(slideInUp, FAST)),
	transition(':leave', useAnimation(slideOutUp, FAST)),
]);

export const SLIDE_RIGHT = trigger('slideRight', [
	transition(':enter', useAnimation(slideInRight, FAST)),
	transition(':leave', useAnimation(slideOutRight, FAST)),
]);
