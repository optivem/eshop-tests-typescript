import type { ThenGivenClockPort } from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import type { GetTimeVerification } from '../../app/clock/usecases/GetTimeVerification.js';

export class ThenGivenClock implements ThenGivenClockPort {
    constructor(private readonly verification: GetTimeVerification) {}

    hasTime(time: string): ThenGivenClockPort;
    hasTime(): ThenGivenClockPort;
    hasTime(time?: string): ThenGivenClockPort {
        if (time !== undefined) {
            this.verification.time(time);
        } else {
            this.verification.timeIsNotNull();
        }
        return this;
    }
}
