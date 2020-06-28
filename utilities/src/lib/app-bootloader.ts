export function appBootloader(appBootstrap: () => any) {
	function domReadyHandler() {
		document.removeEventListener('DOMContentLoaded', domReadyHandler);
		appBootstrap();
	}

	switch (document.readyState) {
		case 'loading':
			document.addEventListener('DOMContentLoaded', domReadyHandler);
			break;
		case 'interactive':
		case 'complete':
		default:
			appBootstrap();
	}
}
