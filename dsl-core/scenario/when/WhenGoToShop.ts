import { VoidVerification } from '@optivem/dsl-core/shared';
import type { AppDsl } from '../../app/AppDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { BaseWhenBuilder } from './BaseWhenStep.js';

/** When-builder for go-to-shop. */
export class GoToShopBuilder extends BaseWhenBuilder<void, VoidVerification> {
    constructor(app: AppDsl) {
        super(app);
    }

    protected override async execute(
        app: AppDsl
    ): Promise<ExecutionResult<void, VoidVerification>> {
        const result = await app.shop().goToShop().execute();
        return new ExecutionResultBuilder(result).build();
    }
}


