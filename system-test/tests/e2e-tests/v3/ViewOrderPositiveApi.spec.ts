import '../../../setup-config.js';
import { test } from './base/fixtures.js';
import { registerViewOrderPositiveBaseTests } from './ViewOrderPositiveBase.js';

registerViewOrderPositiveBaseTests(test, { shopDriverFixture: 'shopApiDriver' });