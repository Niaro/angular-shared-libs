import { animate, query, style, transition, trigger, stagger, sequence, group } from '@angular/animations';

const onNavigationAnimated = 'on-navigation-animated';
const optional = {
	optional: true
};
const except = ':not(mat-toolbar):not(bp-toolbar):not(bp-demostand-toolbar):not(bp-right-drawers):not(bp-menu):not(router-outlet):not(.ignore-route-animation)';
export const ROUTE_ANIMATIONS = trigger('routeAnimations', [
	transition(getTrue, [
		// 100vh for a proper rendering for cdk-virtual-scroll-viewport
		query(`:enter`, style({ opacity: 0, position: 'fixed', height: '100vh' }), optional),

		query(`:enter .${onNavigationAnimated}`, style({ opacity: 0 }), optional),

		group([
			sequence([
				query(
					`:leave`,
					[
						style({ opacity: 1 }),
						animate(
							'0.2s ease-in-out',
							style({ opacity: 0 })
						),
						style({ position: 'fixed' })
					],
					optional
				),
				group([
					query(`:enter`, style({ opacity: 1, position: 'static' }), optional),
					query(
						`:enter > *${except}`,
						[
							style({
								transform: 'translateY(-3%)',
								opacity: 0,
								position: 'static'
							}),
							animate(
								'0.5s ease-in-out',
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
								'0.5s ease-in-out',
								style({ transform: 'translateY(0%)', opacity: 1 })
							)
						],
						optional
					)
				])
			]),

			query(
				`:enter .${onNavigationAnimated}`,
				stagger(100, [
					style({ transform: 'translateY(6%)', opacity: 0 }),
					animate(
						'0.5s ease-in-out',
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
	[transition('* => void', [animate('0ms', style({ display: 'none' }))])]
);
