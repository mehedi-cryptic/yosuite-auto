const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 1500 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'html',

  use: {
    headless: false,
    slowMo: 500,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    viewport: { width: 1440, height: 900 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});