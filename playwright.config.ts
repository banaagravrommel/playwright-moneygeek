import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  
  /* Test timeout - increased for your insurance flow */
  timeout: 120000, // 2 minutes per test
  
  /* Global timeout for the entire test suite */
  globalTimeout: 600000, // 10 minutes total
  
  /* Run tests in files in parallel - disabled for your specific test */
  fullyParallel: false,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Single worker to avoid conflicts with your insurance flow test */
  workers: 1,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }] // For CI integration
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://www.moneygeek.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    
    /* Screenshot configuration */
    screenshot: 'only-on-failure', // Takes screenshots on test failures
    
    /* Video recording */
    video: 'retain-on-failure', // Records video on failure
    
    /* Action and navigation timeouts */
    actionTimeout: 15000, // 15 seconds for individual actions
    navigationTimeout: 30000, // 30 seconds for page navigation
    
    /* Ignore HTTPS errors for testing */
    ignoreHTTPSErrors: true,
    
    /* Default viewport size */
    viewport: { width: 1280, height: 720 },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Your specific settings for the insurance flow
        locale: 'en-US',
        permissions: ['geolocation'],
        geolocation: { latitude: 37.7749, longitude: -122.4194 }, // San Francisco, CA
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
      },
    },

    // Commented out other browsers since your test is Chromium-specific
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

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

  /* Expect configuration */
  expect: {
    /* Maximum time expect() should wait for the condition to be met. */
    timeout: 10000, // 10 seconds for assertions
  },

  /* Output directory for test artifacts */
  outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});