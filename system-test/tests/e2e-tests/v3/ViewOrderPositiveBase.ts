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

export function registerViewOrderPositiveBaseTests(test: BaseTest, options: RegisterOptions): void {
    const getShopDriver = (fixtures: BaseFixtures): ShopDriver => fixtures[options.shopDriverFixture];

    test('should view placed order', async (fixtures: BaseFixtures) => {
        const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
        expect(await fixtures.erpDriver.returnsProduct({ sku, price: '25.00' })).toBeSuccess();

        const placeOrderResult = await getShopDriver(fixtures).orders().placeOrder({ sku, quantity: '4', country: GherkinDefaults.DEFAULT_COUNTRY });
        expect(placeOrderResult).toBeSuccess();

        const orderNumber = placeOrderResult.getValue().orderNumber;
        const viewOrderResult = await getShopDriver(fixtures).orders().viewOrder(orderNumber);
        expect(viewOrderResult).toBeSuccess();

        const order = viewOrderResult.getValue();
        expect(order.orderNumber).toBe(orderNumber);
        expect(order.sku).toBe(sku);
        expect(order.country).toBe(GherkinDefaults.DEFAULT_COUNTRY);
        expect(order.quantity).toEqualInteger(4);
        expect(order.unitPrice).toEqualDecimal(25.0);
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