import { EnvironmentService, TelemetryService } from '@bp/shared/services';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { environment } from 'libs/shared/environments/src/environment';

/**
 * Logic that should be kicked in before execution of the app module file
 */
EnvironmentService.init(environment);
TelemetryService.init(environment);

TelemetryService.log('Environment has been setup');
