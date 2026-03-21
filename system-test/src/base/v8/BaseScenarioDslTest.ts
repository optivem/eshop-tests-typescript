/**
 * Fixture shape for v8 scenario DSL test.
 * Same as v6: app (AppDsl), scenario (ScenarioDsl). Adds BrowserLifecycleExtension.
 * Types unknown to avoid core dependency; implement in system-test.
 * Lifecycle: loadConfiguration(), app = new AppDsl(config), scenario = new ScenarioDsl(app); tearDown close(app).
 */
export interface BaseScenarioDslTestFixture {
    /** AppDsl instance */
    app?: unknown;
    /** ScenarioDsl instance */
    scenario?: unknown;
}
