# @optivem/optivem-testing

Composable Playwright helpers for channelized tests.

## Installation

```bash
npm install @optivem/optivem-testing
```

## Exports

- `withChannels` and channel primitives from `channel`
- `createChannelHelpers(test)`
- `createTestEach(test)`
- `channelTest` (legacy convenience helper)

## Example

```typescript
import { test as base } from '@playwright/test';
import { createChannelHelpers, createTestEach } from '@optivem/optivem-testing';

const _test = base.extend<{ app: MyApp }>({
    app: async ({}, use) => {
        const app = createMyApp();
        await use(app);
        await app.close();
    },
});

const test = Object.assign(_test, { each: createTestEach(_test) });
const { withChannels } = createChannelHelpers(test);

withChannels('UI', 'API')(() => {
    test.each(['3.5', 'lala'])(
        'rejects non-integer quantity ($quantity)',
        async ({ app, quantity }) => {
            await app.placeOrder(quantity);
        },
    );
});
```

## Notes

- This package does **not** define domain fixtures like `app` or `scenario`.
- Build domain fixtures in your test-infrastructure layer, then compose them with these helpers.
