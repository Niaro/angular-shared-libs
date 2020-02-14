import * as LogRocket from 'logrocket';

import { environment as env } from '@bp/environment';

export function whenOnRemoteServerInitLogrocket() {
	if (env.localServer || !env.logrocket)
		return false;

	LogRocket.init(env.logrocket, {
		release: env.version.prerelease,
		dom: assignAssetsUrlIfPrivateApp(),
		console: {
			shouldAggregateConsoleErrors: true,
		},
		network: {
			requestSanitizer(req) {
				// if the url contains 'ignore'
				if (req.url.toLowerCase().includes('deposit'))
					// scrub out the body
					req.body = undefined;

				req.headers['Authorization'] = undefined;
				return req;
			}
		},
	});

	return true;
}

function assignAssetsUrlIfPrivateApp(): { baseHref: string; } | undefined {
	const isMerchantAdminApp = env.logrocket?.includes('merchant-admin');
	const isAdminApp = /^(?!.*merchant).*admin.*$/.test(env.logrocket || '');
	const isDemostand = env.logrocket?.includes('demostand');

	if (!isMerchantAdminApp && !isAdminApp && !isDemostand)
		return;

	const merchantPrefixOrEmpty = isMerchantAdminApp ? 'merchant-' : '';

	return {
		baseHref: isDemostand
			? 'https://cashier-demostand.web.app/'
			: `https://storage.googleapis.com/${merchantPrefixOrEmpty}admin-logrocket-assets/${env.name}/${env.version.prerelease}/`
	};
}
