import { randomUUID } from 'node:crypto';
import { test as base } from '@playwright/test';
import { ShopUiClient } from '@optivem/driver-core/shop/client/ui/ShopUiClient.js';
import { ShopApiClient } from '@optivem/driver-core/shop/client/api/ShopApiClient.js';
import { ErpRealClient } from '@optivem/driver-core/erp/client/ErpRealClient.js';
import { TaxRealClient } from '@optivem/driver-core/tax/client/TaxRealClient.js';
import { Closer, setupResultMatchers } from '@optivem/commons/util';
import { testConfig } from '@optivem/test-infrastructure';

setupResultMatchers();

type V2Fixtures = {
    shopUiClient: ShopUiClient;
    shopApiClient: ShopApiClient;
    erpClient: ErpRealClient;
    taxClient: TaxRealClient;
};

const testBase = base.extend<{
    shopUiClient: ShopUiClient;
    shopApiClient: ShopApiClient;
    erpClient: ErpRealClient;
    taxClient: TaxRealClient;
}>({
    shopUiClient: async ({}, use) => {
        const client = new ShopUiClient(testConfig.urls.shopUi);
        await use(client);
        await client.close();
    },
    shopApiClient: async ({}, use) => {
        const client = new ShopApiClient(testConfig.urls.shopApi);
        await use(client);
        client.close();
    },
    erpClient: async ({}, use) => {
        const client = new ErpRealClient(testConfig.urls.erpApi);
        await use(client);
        await Closer.close(client);
    },
    taxClient: async ({}, use) => {
        const client = new TaxRealClient(testConfig.urls.taxApi);
        await use(client);
        await Closer.close(client);
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

            testBase(testName, async ({ shopUiClient, shopApiClient, erpClient, taxClient }) => {
                await fn({ shopUiClient, shopApiClient, erpClient, taxClient, ...row });
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
