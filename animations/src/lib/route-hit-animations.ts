import { animate, group, query, sequence, stagger, style, transition, trigger } from '@angular/animations';

const slideUpOnRouteHit = 'slide-up-on-route-hit';
const optional = {
	optional: true
};
const except = ':not(mat-toolbar):not(bp-toolbar):not(bp-demostand-toolbar):not(bp-right-drawers):not(bp-menu):not(router-outlet):not(.ignore-route-animation)';

const enterAnimation = '0.5s ease-in-out';
const leaveAnimation = '0.2s ease-in-out';

export const ROUTE_HIT_ANIMATIONS = trigger('routeHitAnimations', [
	transition(getTrue, [
		query(`:enter`, style({ opacity: 0, position: 'fixed' }), optional),

		query(`:enter .${ slideUpOnRouteHit }`, style({ opacity: 0 }), optional),

		group([
			sequence([
				query(
					`:leave, :leave router-outlet + *`,
					[
						style({ opacity: 1 }),
						animate(
							leaveAnimation,
							style({ opacity: 0 })
						),
						style({ position: 'fixed' })
					],
					optional
				),
				group([
					query(`:enter:not(bp-right-drawer)`, style({ opacity: 1, position: 'static' }), optional),
					query(
						`:enter:not(bp-right-drawer) > *${ except }`,
						[
							style({
								transform: 'translateY(-3%)',
								opacity: 0,
								position: 'static'
							}),
							animate(
								enterAnimation,
								style({ transform: 'translateY(0%)', opacity: 1 })
							)
						],
						optional
					),
					query(
						`:enter mat-toolbar`,
						[
							style({
								transform: 'translateY(-10%)',
								opacity: 0
							}),
							animate(
								enterAnimation,
								style({ transform: 'translateY(0%)', opacity: 1 })
							)
						],
						optional
					)
				])
			]),

			query(
				`:enter .${ slideUpOnRouteHit }`,
				stagger(100, [
					style({ transform: 'translateY(6%)', opacity: 0 }),
					animate(
						enterAnimation,
						style({ transform: 'translateY(0%)', opacity: 1 })
					)
				]),
				optional
			)
		])
	])
]);

export function getTrue() {
	return true;
}

// TODO a workaround waiting for https://github.com/angular/material2/issues/8057 being merged
export const INSTANT_HIDE_ON_VOID = trigger(
	'instantHideOnVoid',
	[ transition('* => void', [ animate('0ms', style({ display: 'none' })) ]) ]
);
