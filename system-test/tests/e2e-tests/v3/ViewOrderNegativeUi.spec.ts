import '../../../setup-config.js';
import { test } from './base/fixtures.js';
import { registerViewOrderNegativeBaseTests } from './ViewOrderNegativeBase.js';

registerViewOrderNegativeBaseTests(test, { shopDriverFixture: 'shopUiDriver' });