import type { ResponseVerification } from '@optivem/dsl-core/shared';
import type { AppDsl } from '../../app/AppDsl.js';
import type { ExecutionResult } from '../ExecutionResult.js';
import { ThenClause } from '../then/Then.js';

export abstract class BaseWhenBuilder<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    constructor(protected readonly app: AppDsl, private readonly setup?: () => Promise<void>) {}

    then(): ThenClause<TSuccessResponse, TSuccessVerification> {
        return new ThenClause(this.app, async () => {
            if (this.setup) await this.setup();
            return this.execute(this.app);
        });
    }

    protected abstract execute(app: AppDsl): Promise<ExecutionResult<TSuccessResponse, TSuccessVerification>>;
}


