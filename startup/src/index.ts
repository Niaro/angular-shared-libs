import { environment } from '@bp/shared/environments';
import { EnvironmentService, TelemetryService } from '@bp/shared/services';

/**
 * Logic that should be kicked in before execution of the app module file
 */
EnvironmentService.init(environment);
TelemetryService.init(environment);

TelemetryService.log('Environment has been setup');
