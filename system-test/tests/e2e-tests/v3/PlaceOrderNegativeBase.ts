import { GherkinDefaults } from '@optivem/dsl/gherkin/GherkinDefaults.js';
import type { ShopDriver } from '@optivem/core/shop/driver/ShopDriver.js';
import { emptyArgumentsProvider } from '../../shared/argumentProviders.js';
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

const validationError = 'The request contains one or more validation errors';

export function registerPlaceOrderNegativeBaseTests(test: BaseTest, options: RegisterOptions): void {
    const getShopDriver = (fixtures: BaseFixtures): ShopDriver => fixtures[options.shopDriverFixture];

    test('should reject order with invalid quantity', async (fixtures: BaseFixtures) => {
        const result = await getShopDriver(fixtures).orders().placeOrder({
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: 'invalid-quantity',
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });
        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Quantity must be an integer');
    });

    test('should reject order with non-existent SKU', async (fixtures: BaseFixtures) => {
        const result = await getShopDriver(fixtures).orders().placeOrder({
            sku: 'NON-EXISTENT-SKU-12345',
            quantity: GherkinDefaults.DEFAULT_QUANTITY,
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });
        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Product does not exist for SKU: NON-EXISTENT-SKU-12345');
    });

    test('should reject order with negative quantity', async (fixtures: BaseFixtures) => {
        const result = await getShopDriver(fixtures).orders().placeOrder({
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: '-10',
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });
        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Quantity must be positive');
    });

    test('should reject order with zero quantity', async (fixtures: BaseFixtures) => {
        const result = await getShopDriver(fixtures).orders().placeOrder({
            sku: 'ANOTHER-SKU-67890',
            quantity: '0',
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });
        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Quantity must be positive');
    });

    test('should reject order with empty SKU', async (fixtures: BaseFixtures) => {
        for (const sku of emptyArgumentsProvider) {
            const result = await getShopDriver(fixtures).orders().placeOrder({
                sku,
                quantity: GherkinDefaults.DEFAULT_QUANTITY,
                country: GherkinDefaults.DEFAULT_COUNTRY,
            });
            expect(result).toHaveErrorMessage(validationError);
            expect(result).toHaveFieldError('SKU must not be empty');
        }
    });

    test('should reject order with empty quantity', async (fixtures: BaseFixtures) => {
        for (const emptyQuantity of emptyArgumentsProvider) {
            const result = await getShopDriver(fixtures).orders().placeOrder({
                sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
                quantity: emptyQuantity,
                country: GherkinDefaults.DEFAULT_COUNTRY,
            });
            expect(result).toHaveErrorMessage(validationError);
            expect(result).toHaveFieldError('Quantity must not be empty');
        }
    });

    test('should reject order with non-integer quantity', async (fixtures: BaseFixtures) => {
        for (const nonIntegerQuantity of ['3.5', 'lala']) {
            const result = await getShopDriver(fixtures).orders().placeOrder({
                sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
                quantity: nonIntegerQuantity,
                country: GherkinDefaults.DEFAULT_COUNTRY,
            });
            expect(result).toHaveErrorMessage(validationError);
            expect(result).toHaveFieldError('Quantity must be an integer');
        }
    });

    test('should reject order with empty country', async (fixtures: BaseFixtures) => {
        for (const emptyCountry of emptyArgumentsProvider) {
            const result = await getShopDriver(fixtures).orders().placeOrder({
                sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
                quantity: GherkinDefaults.DEFAULT_QUANTITY,
                country: emptyCountry,
            });
            expect(result).toHaveErrorMessage(validationError);
            expect(result).toHaveFieldError('Country must not be empty');
        }
    });

    test('should reject order with invalid country', async (fixtures: BaseFixtures) => {
        const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
        expect(await fixtures.erpDriver.returnsProduct({ sku, price: '20.00' })).toBeSuccess();
        const result = await getShopDriver(fixtures).orders().placeOrder({
            sku,
            quantity: GherkinDefaults.DEFAULT_QUANTITY,
            country: 'XX',
        });
        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Country does not exist: XX');
    });
}