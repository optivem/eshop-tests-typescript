# TypeScript-specific instructions

_Shared instructions (ATDD rules, architecture, git safety) are in the `eshop-tests` repository, loaded automatically via the workspace._

## Test Location

- **Acceptance tests** go in `system-test/tests/v8/acceptance/`
- **Contract tests** go in `system-test/tests/v8/contract/<system>/` (e.g. `erp/`, `tax/`, `clock/`)
- Do **NOT** use v1–v7 directories for new acceptance/contract tests. All new tests go in v8.

## Test Pattern

Acceptance tests use the ScenarioDSL pattern — **not** raw driver calls.

```typescript
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/app/shop/ChannelType.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('can place order', async ({ scenario }) => {
        await scenario
            .given().product()
                .withSku('SKU-001')
                .withUnitPrice('10.00')
            .when().placeOrder()
                .withSku('SKU-001')
                .withQuantity('2')
            .then().shouldSucceed();
    });
});
```

Key rules:
- Wrap all tests in `forChannels(ChannelType.UI, ChannelType.API)(() => { ... })` — **no separate API/UI files**
- Use `await scenario.given()...when()...then()` DSL — not raw drivers
- File names: `<UseCase>Positive.spec.ts` and `<UseCase>Negative.spec.ts` (one file each)
- Contract tests use `forChannels` from the contract base fixtures
