import { BaseUseCase, UseCaseContext } from '@optivem/dsl-core/shared';
import type { ErpDriver } from '@optivem/driver-port/erp/ErpDriver.js';
import type { ErpErrorResponse } from '@optivem/driver-port/erp/dtos/error/ErpErrorResponse.js';
import { ErpErrorVerification } from './ErpErrorVerification.js';

export abstract class BaseErpCommand<TResponse, TVerification> extends BaseUseCase<
    ErpDriver,
    TResponse,
    ErpErrorResponse,
    TVerification,
    ErpErrorVerification
> {
    protected constructor(driver: ErpDriver, context: UseCaseContext) {
        super(driver, context);
    }
}




