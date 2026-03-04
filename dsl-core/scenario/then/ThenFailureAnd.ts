import type { ResponseVerification } from '@optivem/dsl-common/dsl';
import type { AppDsl } from '../../app/AppDsl.js';
import type { SystemErrorFailureVerification } from '../../app/shop/usecases/base/SystemErrorFailureVerification.js';
import type { ThenClause } from './Then.js';
import { ThenFailureOrderVerifier } from './ThenFailureOrder.js';
import { ThenFailureCouponVerifier } from './ThenFailureCoupon.js';

/**
 * Returned by .shouldFail().and() — bridges to .order() / .coupon() on the failure path.
 */
export class ThenFailureAnd<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    constructor(
        private readonly app: AppDsl,
        private readonly thenClause: ThenClause<TSuccessResponse, TSuccessVerification>,
        private readonly failureAssertions: Array<(v: SystemErrorFailureVerification) => void>
    ) {}

    order(orderNumber?: string): ThenFailureOrderVerifier<TSuccessResponse, TSuccessVerification> {
        const thenClause = this.thenClause;
        const assertions = this.failureAssertions;
        const orderNumberFactory = async (): Promise<string> => {
            if (orderNumber != null) return orderNumber;
            const result = await thenClause.getExecutionResult();
            const context = result.getContext();
            const resolved = context.getOrderNumber();
            if (resolved == null) {
                throw new Error('Cannot verify order: no order number available from the executed operation');
            }
            return resolved;
        };
        return new ThenFailureOrderVerifier<TSuccessResponse, TSuccessVerification>(thenClause, assertions, orderNumberFactory);
    }

    coupon(couponCode?: string): ThenFailureCouponVerifier<TSuccessResponse, TSuccessVerification> {
        const thenClause = this.thenClause;
        const assertions = this.failureAssertions;
        const couponCodeFactory = async (): Promise<string> => {
            if (couponCode != null) return couponCode;
            const result = await thenClause.getExecutionResult();
            const context = result.getContext();
            const resolved = context.getCouponCode();
            if (resolved == null) {
                throw new Error('Cannot verify coupon: no coupon code available from the executed operation');
            }
            return resolved;
        };
        return new ThenFailureCouponVerifier<TSuccessResponse, TSuccessVerification>(thenClause, assertions, couponCodeFactory);
    }
}
