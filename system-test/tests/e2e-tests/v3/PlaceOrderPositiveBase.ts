import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';
import type { ShopDriver } from '@optivem/core/shop/driver/ShopDriver.js';
import { GherkinDefaults } from '@optivem/dsl/gherkin/GherkinDefaults.js';
import { expect, createUniqueSku } from './base/fixtures.js';

type ErpDriver = {
    returnsProduct: (request: { sku: string; price: string }) => Promise<unknown>;
};

type BaseFixtures = {
    shopUiDriver: ShopDriver;
    shopApiDriver: ShopDriver;
    erpDriver: ErpDriver;
};

type BaseTest = (title: string, body: (fixtures: BaseFixtures) => Promise<void>) => void;

type RegisterOptions = {
    shopDriverFixture: 'shopUiDriver' | 'shopApiDriver';
};

const subtotalPriceCases = [
    { unitPrice: '20.00', quantity: '5', subtotalPrice: '100.00' },
    { unitPrice: '10.00', quantity: '3', subtotalPrice: '30.00' },
    { unitPrice: '15.50', quantity: '4', subtotalPrice: '62.00' },
    { unitPrice: '99.99', quantity: '1', subtotalPrice: '99.99' },
];

export function registerPlaceOrderPositiveBaseTests(test: BaseTest, options: RegisterOptions): void {
    const getShopDriver = (fixtures: BaseFixtures): ShopDriver => fixtures[options.shopDriverFixture];

    test('should place order with correct subtotal price', async (fixtures: BaseFixtures) => {
        const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
        expect(await fixtures.erpDriver.returnsProduct({ sku, price: '20.00' })).toBeSuccess();

        const placeOrderResult = await getShopDriver(fixtures).orders().placeOrder({ sku, quantity: '5', country: GherkinDefaults.DEFAULT_COUNTRY });
        expect(placeOrderResult).toBeSuccess();

        const orderNumber = placeOrderResult.getValue().orderNumber;
        const viewOrderResult = await getShopDriver(fixtures).orders().viewOrder(orderNumber);
        expect(viewOrderResult).toBeSuccess();
        expect(viewOrderResult.getValue().subtotalPrice).toEqualDecimal(100.0);
    });

    test('should place order with correct subtotal price parameterized', async (fixtures: BaseFixtures) => {
        for (const { unitPrice, quantity, subtotalPrice } of subtotalPriceCases) {
            const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
            expect(await fixtures.erpDriver.returnsProduct({ sku, price: unitPrice })).toBeSuccess();

            const placeOrderResult = await getShopDriver(fixtures).orders().placeOrder({ sku, quantity, country: GherkinDefaults.DEFAULT_COUNTRY });
            expect(placeOrderResult).toBeSuccess();

            const orderNumber = placeOrderResult.getValue().orderNumber;
            const viewOrderResult = await getShopDriver(fixtures).orders().viewOrder(orderNumber);
            expect(viewOrderResult).toBeSuccess();
            expect(viewOrderResult.getValue().subtotalPrice).toEqualDecimal(subtotalPrice);
        }
    });

    test('should place order', async (fixtures: BaseFixtures) => {
        const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
        expect(await fixtures.erpDriver.returnsProduct({ sku, price: '20.00' })).toBeSuccess();

        const placeOrderResult = await getShopDriver(fixtures).orders().placeOrder({ sku, quantity: '5', country: GherkinDefaults.DEFAULT_COUNTRY });
        expect(placeOrderResult).toBeSuccess();

        const orderNumber = placeOrderResult.getValue().orderNumber;
        expect(orderNumber.startsWith('ORD-')).toBe(true);

        const viewOrderResult = await getShopDriver(fixtures).orders().viewOrder(orderNumber);
        expect(viewOrderResult).toBeSuccess();

        const order = viewOrderResult.getValue();
        expect(order.orderNumber).toBe(orderNumber);
        expect(order.sku).toBe(sku);
        expect(order.country).toBe(GherkinDefaults.DEFAULT_COUNTRY);
        expect(order.quantity).toEqualInteger(5);
        expect(order.unitPrice).toEqualDecimal(20.0);
        expect(order.subtotalPrice).toEqualDecimal(100.0);
        expect(order.status).toBe(OrderStatus.PLACED);
        expect(order.discountRate).toBeGreaterThanOrEqualDecimal(0);
        expect(order.discountAmount).toBeGreaterThanOrEqualDecimal(0);
        expect(order.subtotalPrice).toBeGreaterThanDecimal(0);
        expect(order.taxRate).toBeGreaterThanOrEqualDecimal(0);
        expect(order.taxAmount).toBeGreaterThanOrEqualDecimal(0);
        expect(order.totalPrice).toBeGreaterThanDecimal(0);
    });
}