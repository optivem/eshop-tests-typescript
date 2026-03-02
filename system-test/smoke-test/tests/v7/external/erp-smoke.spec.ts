/** V7 smoke test: AppDsl ERP. */
import '../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V7 External – ERP', () => {
    test('should be able to go to ERP', async ({ app }) => {
        (await app.erp().goToErp()
            .execute())
            .shouldSucceed();
    });
});
