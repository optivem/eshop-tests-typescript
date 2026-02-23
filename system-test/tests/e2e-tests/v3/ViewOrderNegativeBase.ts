import type { ShopDriver } from '@optivem/core/shop/driver/ShopDriver.js';
import { expect } from './base/fixtures.js';

type BaseFixtures = {
    shopUiDriver: ShopDriver;
    shopApiDriver: ShopDriver;
};

type BaseTest = (title: string, body: (fixtures: BaseFixtures) => Promise<void>) => void;

type RegisterOptions = {
    shopDriverFixture: 'shopUiDriver' | 'shopApiDriver';
};

const nonExistentOrderCases = [
    { orderNumber: 'NON-EXISTENT-ORDER-99999', expectedMessage: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-88888', expectedMessage: 'Order NON-EXISTENT-ORDER-88888 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-77777', expectedMessage: 'Order NON-EXISTENT-ORDER-77777 does not exist.' },
];

export function registerViewOrderNegativeBaseTests(test: BaseTest, options: RegisterOptions): void {
    const getShopDriver = (fixtures: BaseFixtures): ShopDriver => fixtures[options.shopDriverFixture];

    test('should not be able to view non-existent order', async (fixtures: BaseFixtures) => {
        for (const { orderNumber, expectedMessage } of nonExistentOrderCases) {
            const result = await getShopDriver(fixtures).orders().viewOrder(orderNumber);
            expect(result).toBeFailureWith(expectedMessage);
        }
    });
}