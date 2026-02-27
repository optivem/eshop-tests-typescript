# System Test Configuration
# This file contains configuration values for Run-SystemTests.ps1

$Config = @{

    BuildCommands = @(
        @{  Name = "Clean Install";
            Command = "npm ci"
        },
        @{  Name = "Build Packages";
            Command = "npm run build"
        }
    )

    Tests = @(
        @{  Id = "smoke";
            Name = "Smoke Tests";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=REAL npm test";
            Path = "system-test/smoke-test";
            TestReportPath = "system-test/smoke-test/playwright-report/index.html"
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-api";
            Name = "Acceptance Tests - Channel: API";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=STUB CHANNEL=API npm test -- --grep-invert `"@isolated`"";
            Path = "system-test/acceptance-test";
            TestReportPath = "system-test/acceptance-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-ui";
            Name = "Acceptance Tests - Channel: UI";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=STUB CHANNEL=UI npm test -- --grep-invert `"@isolated`"";
            Path = "system-test/acceptance-test";
            TestReportPath = "system-test/acceptance-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-isolated-api";
            Name = "Acceptance Tests (Isolated) - Channel: API";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=STUB CHANNEL=API npm test -- --grep `"@isolated`" --workers=1";
            Path = "system-test/acceptance-test";
            TestReportPath = "system-test/acceptance-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-isolated-ui";
            Name = "Acceptance Tests (Isolated) - Channel: UI";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=STUB CHANNEL=UI npm test -- --grep `"@isolated`" --workers=1";
            Path = "system-test/acceptance-test";
            TestReportPath = "system-test/acceptance-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "contract-stub";
            Name = "External System Contract Tests - Stubbed External Systems";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=STUB npm test -- --workers=1";
            Path = "system-test/external-system-contract-test";
            TestReportPath = "system-test/external-system-contract-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "contract-real";
            Name = "External System Contract Tests - Real External Systems";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=REAL npm test -- --workers=1";
            Path = "system-test/external-system-contract-test";
            TestReportPath = "system-test/external-system-contract-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{
            Id = "e2e-no-channel";
            Name = "E2E Tests - No Channel (v1, v2, v3)";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=REAL npm test -- tests/v1 tests/v2 tests/v3";
            Path = "system-test/e2e-test";
            TestReportPath = "system-test/e2e-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{
            Id = "e2e-api";
            Name = "E2E Tests - Channel: API";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=REAL CHANNEL=API npm test";
            Path = "system-test/e2e-test";
            TestReportPath = "system-test/e2e-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{
            Id = "e2e-ui";
            Name = "E2E Tests - Channel: UI";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=REAL CHANNEL=UI npm test";
            Path = "system-test/e2e-test";
            TestReportPath = "system-test/e2e-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) }
    )
}

# Export the configuration
return $Config

