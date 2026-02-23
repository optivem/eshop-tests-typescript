import '../../../setup-config.js';
import { test, expect } from './base/fixtures.js';
import { viewOrderUsingUiClient } from './base/shopUiClientOrderFlows.js';

const nonExistentOrderCases = [
    { orderNumber: 'NON-EXISTENT-ORDER-99999', expectedMessage: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-88888', expectedMessage: 'Order NON-EXISTENT-ORDER-88888 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-77777', expectedMessage: 'Order NON-EXISTENT-ORDER-77777 does not exist.' },
];

test('should not be able to view non-existent order', async ({ shopUiClient }) => {
    for (const { orderNumber, expectedMessage } of nonExistentOrderCases) {
        const result = await viewOrderUsingUiClient(shopUiClient, orderNumber);
        expect(result).toBeFailureWith(expectedMessage);
    }
});