import type { ThenGivenProductPort } from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import type { GetProductVerification } from '../../app/erp/usecases/GetProductVerification.js';

export class ThenGivenProduct implements ThenGivenProductPort {
    constructor(private readonly verification: GetProductVerification) {}

    hasSku(sku: string): ThenGivenProductPort {
        this.verification.sku(sku);
        return this;
    }

    hasPrice(price: number): ThenGivenProductPort {
        this.verification.price(price.toString());
        return this;
    }
}
