/**
 * V5 e2e fixtures: app (SystemDsl).
 * Mirrors reference V5 BaseE2eTest (BaseSystemDslTest with REAL mode).
 */
process.env.EXTERNAL_SYSTEM_MODE = process.env.EXTERNAL_SYSTEM_MODE ?? 'REAL';

import { test as base } from '@playwright/test';
import type { SystemDsl } from '@optivem/dsl-core/system/SystemDsl.js';
import { ChannelContext, withChannels as sharedWithChannels } from '@optivem/optivem-testing';
import { SystemDslFactory, getDefaultExternalSystemMode } from '@optivem/test-infrastructure';

const testBase = base.extend<{ app: SystemDsl }>({
    app: async ({}, use) => {
        const app = SystemDslFactory.create(getDefaultExternalSystemMode());
        await use(app);
        await app.close();
    },
});

const testEach = <TCase extends Record<string, unknown>>(
    cases: ReadonlyArray<TCase>
): ((name: string, fn: (args: { app: SystemDsl } & TCase) => Promise<void>) => void) => {
    return (name: string, fn: (args: { app: SystemDsl } & TCase) => Promise<void>): void => {
        cases.forEach((row) => {
            const testName = name.replaceAll(/\$(\w+)/g, (_, key) => {
                const value = row[key as keyof TCase];
                if (typeof value === 'string') return value;
                if (typeof value === 'number') return value.toString();
                return '';
            });

            testBase(testName, async ({ app }) => {
                await fn({ app, ...row } as { app: SystemDsl } & TCase);
            });
        });
    };
};

export const test = testBase as typeof testBase & { each: typeof testEach };
test.each = testEach;

export { expect } from '@playwright/test';

export interface AppChannelFixtures {
    app: SystemDsl;
}

export function channelAppTest(
    channelTypes: string[],
    testName: string,
    testFn: (fixtures: AppChannelFixtures) => Promise<void>
): void {
    const channelEnv = process.env.CHANNEL;
    const channelsToRun =
        channelEnv != null && channelEnv !== ''
            ? channelTypes.filter((c) => c === channelEnv)
            : channelTypes;

    for (const channel of channelsToRun) {
        test(`[${channel} Channel] ${testName}`, async ({ app }) => {
            try {
                ChannelContext.set(channel);
                await testFn({ app });
            } finally {
                ChannelContext.clear();
            }
        });
    }
}

export function Channel(
    ...channelTypes: string[]
): (testName: string, testFn: (fixtures: AppChannelFixtures) => Promise<void>) => void {
    return (testName: string, testFn: (fixtures: AppChannelFixtures) => Promise<void>) => {
        channelAppTest(channelTypes, testName, testFn);
    };
}

export function withChannels(...channelTypes: string[]): (block: () => void) => void {
    return sharedWithChannels(
        {
            describe: (name, callback) => test.describe(name, callback),
            beforeEach: (callback) => test.beforeEach(callback),
            afterEach: (callback) => test.afterEach(callback),
        },
        ...channelTypes
    );
}
