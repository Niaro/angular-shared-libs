import { animate, query, style, transition, trigger, stagger, sequence } from '@angular/animations';

const onNavigationAnimated = 'on-navigation-animated';
const optional = {
	optional: true
};

export const ROUTE_ANIMATIONS = trigger('routeAnimations', [
	transition(() => true, [
		query('router-outlet + :enter > *', style({ opacity: 0, position: 'fixed' }), optional),

		query(`router-outlet + :enter .${onNavigationAnimated}`, style({ opacity: 0 }), optional),

		sequence([
			query(
				'router-outlet + :leave > *',
				[
					style({ transform: 'translateY(0%)', opacity: 1 }),
					animate(
						'0.2s ease-in-out',
						style({ transform: 'translateY(-3%)', opacity: 0 })
					),
					style({ position: 'fixed' })
				],
				optional
			),
			query(
				'router-outlet + :enter > *',
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
			)
		]),

		query(
			`router-outlet + :enter .${onNavigationAnimated}`,
			stagger(-50, [
				style({ transform: 'translateY(6%)', opacity: 0 }),
				animate(
					'0.5s ease-in-out',
					style({ transform: 'translateY(0%)', opacity: 1 })
				)
			]),
			optional
		)
	])
]);
