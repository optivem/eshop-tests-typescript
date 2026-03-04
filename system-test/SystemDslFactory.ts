import type { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import { AppDsl } from '../dsl-core/app/AppDsl.js';
import { SystemConfigurationLoader } from './SystemConfigurationLoader.js';

export class SystemDslFactory {
  static create(externalSystemMode: ExternalSystemMode): AppDsl {
    const configuration = SystemConfigurationLoader.load(externalSystemMode);
    return new AppDsl(configuration);
  }
}



