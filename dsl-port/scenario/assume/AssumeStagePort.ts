export interface AssumeStagePort {
    shop(): ShouldPort;
    erp(): ShouldPort;
    tax(): ShouldPort;
    clock(): ShouldPort;
}

export interface ShouldPort {
    shouldBeRunning(): Promise<AssumeStagePort>;
}
