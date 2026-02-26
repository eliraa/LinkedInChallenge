import { defineConfig, devices } from "@playwright/test";
import { loadEnvFile } from "./env";

loadEnvFile();

const activeEnvironment = process.env.TEST_ENV ?? "staging";

const environmentBaseUrls: Record<string, string> = {
  local: process.env.BASE_URL_LOCAL ?? "http://localhost:4200",
  staging: process.env.BASE_URL_STAGING ?? "https://practicesoftwaretesting.com",
};

const selectedBaseUrl =
  environmentBaseUrls[activeEnvironment] ?? environmentBaseUrls.staging;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 30_000,
  globalTimeout: 10 * 60 * 1000,
  expect: {
    timeout: 10_000,
  },
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI 2 times and locally 1 time */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html"], ["list"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: selectedBaseUrl,
    testIdAttribute: "data-test",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on",
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    headless: true,
  },

  /* Configure projects for major browsers */
  projects: [
  // Setup runs ONLY the auth setup file (now located under Login/)
  {
    name: "setup",
    testMatch: /Login[\\/]+auth\.setup\.ts/,
  },

  // Guest-only: run everything EXCEPT auth.setup.ts and logged-only specs
  {
    name: "chromium",
    testIgnore: [
      /auth\.setup\.ts/,
      /checkout\.spec\.ts/, // logged-only test (authenticated checkout)
    ],
    use: {
      ...devices["Desktop Chrome"],
    },
  },

  // Auth-only: run everything EXCEPT auth.setup.ts and guest-only specs
  {
    name: "chromium-auth",
    dependencies: ["setup"],
    testIgnore: [
      /auth\.setup\.ts/,
      /checkoutGuest\.spec\.ts/, // guest-only test
    ],
    use: {
      ...devices["Desktop Chrome"],
      storageState: ".auth/customer.json",
    },
  },

  // Optional: if you still want webkit to run authenticated suite
  {
    name: "webkit",
    dependencies: ["setup"],
    testIgnore: [
      /auth\.setup\.ts/,
      /checkoutGuest\.spec\.ts/,
    ],
    use: {
      ...devices["Desktop Safari"],
      storageState: ".auth/customer.json",
    },
  },


    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

