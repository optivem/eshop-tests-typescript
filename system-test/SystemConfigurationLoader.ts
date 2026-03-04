import type { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import { AppConfiguration } from '../dsl-core/app/AppConfiguration.js';
import { testConfig } from './test.config.js';

export class SystemConfigurationLoader {
  static load(externalSystemMode: ExternalSystemMode): AppConfiguration {
    return new AppConfiguration(
      testConfig.urls.shopUi,
      testConfig.urls.shopApi,
      testConfig.urls.erpApi,
      testConfig.urls.taxApi,
      testConfig.urls.clockApi,
      externalSystemMode
    );
  }
}



