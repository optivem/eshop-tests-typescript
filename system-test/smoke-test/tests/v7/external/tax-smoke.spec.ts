/** V7 smoke test: AppDsl tax. */
import '../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V7 External – Tax', () => {
    test('should be able to go to tax', async ({ app }) => {
        (await app.tax().goToTax()
            .execute())
            .shouldSucceed();
    });
});
