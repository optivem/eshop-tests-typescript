import type { AppDsl } from '../../app/AppDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { BaseWhenBuilder } from './BaseWhenStep.js';
import type { BrowseCouponsResponse } from '@optivem/driver-port/shop/dtos/index.js';
import type { BrowseCouponsVerification } from '../../app/shop/usecases/BrowseCouponsVerification.js';

export class BrowseCouponsBuilder extends BaseWhenBuilder<BrowseCouponsResponse, BrowseCouponsVerification> {
    constructor(app: AppDsl) {
        super(app);
    }

    protected override async execute(
        app: AppDsl
    ): Promise<ExecutionResult<BrowseCouponsResponse, BrowseCouponsVerification>> {
        const result = await app
            .shop()
            .browseCoupons()
            .execute();

        return new ExecutionResultBuilder(result).build();
    }
}


