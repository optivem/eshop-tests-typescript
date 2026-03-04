import type { ThenGivenCountryPort } from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import type { GetTaxVerification } from '../../app/tax/usecases/GetTaxVerification.js';

export class ThenGivenCountry implements ThenGivenCountryPort {
    constructor(private readonly verification: GetTaxVerification) {}

    hasCountry(country: string): ThenGivenCountryPort {
        this.verification.country(country);
        return this;
    }

    hasTaxRate(taxRate: number): ThenGivenCountryPort {
        this.verification.taxRate(taxRate);
        return this;
    }

    hasTaxRateIsPositive(): ThenGivenCountryPort {
        this.verification.taxRateIsPositive();
        return this;
    }
}
