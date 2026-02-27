/**
 * V7 acceptance test fixtures: same as smoke v7 but force STUB external system mode.
 */
process.env.EXTERNAL_SYSTEM_MODE = process.env.EXTERNAL_SYSTEM_MODE ?? 'STUB';

import { createChannelHelpers, createTestEach } from '@optivem/optivem-testing';
import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import type { SystemDsl } from '@optivem/dsl-core/system/SystemDsl.js';
import { withApp, withScenario } from '@optivem/test-infrastructure';

const _test = withScenario(withApp(), (app: SystemDsl) => new ScenarioDsl(app));
type TestEach = ReturnType<typeof createTestEach>;
const test: typeof _test & { each: TestEach } = Object.assign(_test, { each: createTestEach(_test) });

const { withChannels } = createChannelHelpers(test);

export { test, withChannels };
export { expect } from '@playwright/test';
