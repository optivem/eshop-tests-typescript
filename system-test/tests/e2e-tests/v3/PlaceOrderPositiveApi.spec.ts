import '../../../setup-config.js';
import { test } from './base/fixtures.js';
import { registerPlaceOrderPositiveBaseTests } from './PlaceOrderPositiveBase.js';

registerPlaceOrderPositiveBaseTests(test, { shopDriverFixture: 'shopApiDriver' });