import type { AssumeStagePort, ShouldPort } from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import type { AppDsl } from '../../app/AppDsl.js';

export class AssumeStage implements AssumeStagePort {
    constructor(private readonly app: AppDsl) {}

    shop(): ShouldPort {
        return new ShouldAction(async () => {
            (await this.app.shop().goToShop().execute()).shouldSucceed();
        }, this);
    }

    erp(): ShouldPort {
        return new ShouldAction(async () => {
            (await this.app.erp().goToErp().execute()).shouldSucceed();
        }, this);
    }

    tax(): ShouldPort {
        return new ShouldAction(async () => {
            (await this.app.tax().goToTax().execute()).shouldSucceed();
        }, this);
    }

    clock(): ShouldPort {
        return new ShouldAction(async () => {
            (await this.app.clock().goToClock().execute()).shouldSucceed();
        }, this);
    }
}

class ShouldAction implements ShouldPort {
    constructor(
        private readonly action: () => Promise<void>,
        private readonly assumeStage: AssumeStagePort
    ) {}

    async shouldBeRunning(): Promise<AssumeStagePort> {
        await this.action();
        return this.assumeStage;
    }
}
