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

const testEach = <TCase extends Record<string, unknown>>(
    cases: ReadonlyArray<TCase>
): ((name: string, fn: (args: V2Fixtures & TCase) => Promise<void>) => void) => {
    return (name: string, fn: (args: V2Fixtures & TCase) => Promise<void>): void => {
        cases.forEach((row) => {
            const testName = name.replaceAll(/\$(\w+)/g, (_, key) => {
                const value = row[key as keyof TCase];
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
