/**
 * V4 e2e fixtures: channel-based shop driver + external drivers (ERP/Tax).
 * Mirrors reference V4 driver-level style (no ScenarioDsl).
 */
import { randomUUID } from 'node:crypto';
import { test as base } from '@playwright/test';
import type { ShopDriver } from '@optivem/driver-core/shop/driver/ShopDriver.js';
import { Closer, setupResultMatchers } from '@optivem/commons/util';
import {
    createShopUiDriver,
    createShopApiDriver,
    createErpDriver,
    createTaxApiDriver,
    getExternalSystemMode,
} from '@optivem/test-infrastructure';

setupResultMatchers();

type V3Fixtures = {
    shopUiDriver: ShopDriver;
    shopApiDriver: ShopDriver;
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
};

const testBase = base.extend<{
    shopUiDriver: ShopDriver;
    shopApiDriver: ShopDriver;
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
}>({
    shopUiDriver: async ({}, use) => {
        const driver = createShopUiDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
    shopApiDriver: async ({}, use) => {
        const driver = createShopApiDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
    erpDriver: async ({}, use) => {
        const driver = createErpDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
    taxDriver: async ({}, use) => {
        const driver = createTaxApiDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
});

const testEach = <TCase>(
    cases: ReadonlyArray<TCase>
): ((name: string, fn: (args: any) => Promise<void>) => void) => {
    return (name: string, fn: (args: any) => Promise<void>): void => {
        const placeholderKeys = Array.from(name.matchAll(/\$(\w+)/g)).map((match) => match[1]);
        const uniquePlaceholderKeys = [...new Set(placeholderKeys)];

        cases.forEach((rawRow) => {
            let row: Record<string, unknown>;
            if (rawRow != null && typeof rawRow === 'object' && !Array.isArray(rawRow)) {
                row = rawRow as Record<string, unknown>;
            } else if (uniquePlaceholderKeys.length === 1) {
                row = { [uniquePlaceholderKeys[0]]: rawRow };
            } else if (uniquePlaceholderKeys.length === 0) {
                row = { value: rawRow };
            } else {
                throw new Error(
                    `test.each: scalar rows require exactly one placeholder in test name, but got ${uniquePlaceholderKeys.length}`,
                );
            }

            const testName = name.replace(/\$(\w+)/g, (_: string, key: string) => {
                const value = row[key];
                if (typeof value === 'string') return value;
                if (typeof value === 'number') return value.toString();
                return '';
            });

            testBase(testName, async ({ shopUiDriver, shopApiDriver, erpDriver, taxDriver }) => {
                await fn({ shopUiDriver, shopApiDriver, erpDriver, taxDriver, ...row });
            });
        });
    };
};

export const test = testBase as typeof testBase & { each: typeof testEach };
test.each = testEach;

export { expect } from '@playwright/test';

export function createUniqueSku(baseSku: string): string {
    const suffix = randomUUID().replace(/-/g, '').slice(0, 8);
    return `${baseSku}-${suffix}`;
}
