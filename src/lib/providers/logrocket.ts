import * as LogRocket from 'logrocket';

import { environment as env } from '@bp/environment';

export function initLogrocketIfOnRemoteServer() {
	if (env.localServer || !env.logrocket)
		return;

	LogRocket.init(env.logrocket, {
		release: env.version.prerelease,
		dom: assignAssetsUrlIfPrivateApp(),
		console: {
			shouldAggregateConsoleErrors: true,
		},
		network: sanitizeNetwork(),
	});
}

function assignAssetsUrlIfPrivateApp(): { baseHref: string; } | undefined {
	const isMerchantAdminApp = env.logrocket?.includes('merchant-admin');
	const isAdminApp = /^(?!.*merchant).*admin.*$/.test(env.logrocket || '');

	if (!isMerchantAdminApp && !isAdminApp)
		return;

	const merchantPrefixOrEmpty = isMerchantAdminApp ? 'merchant-' : '';

	return {
		baseHref: `https://storage.googleapis.com/${merchantPrefixOrEmpty}admin-logrocket-assets/${env.name}/${env.version.prerelease}`
	};
}

function sanitizeNetwork() {
	return {
		requestSanitizer: (request: { url: string, body: any, headers: Dictionary<string | undefined>; }) => {
			// if the url contains 'ignore'
			if (request.url.toLowerCase().includes('deposit'))
				// scrub out the body
				request.body = undefined;

			request.headers['Authorization'] = undefined;
			return request;
		}
	};
}
