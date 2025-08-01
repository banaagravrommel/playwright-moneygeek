import { defineConfig, devices } from '@playwright/test';

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
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
    ['github'] // GitHub Actions reporter
  ] : [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }]
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://www.moneygeek.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    
    /* Screenshot configuration */
    screenshot: 'only-on-failure',
    
    /* Video recording - only on failure for CI to save space */
    video: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    
    /* Action and navigation timeouts */
    actionTimeout: 15000,
    navigationTimeout: 30000,
    
    /* Ignore HTTPS errors for testing */
    ignoreHTTPSErrors: true,
    
    /* Default viewport size */
    viewport: { width: 1280, height: 720 },
    
    /* Headless mode for CI */
    headless: process.env.CI ? true : false,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        locale: 'en-US',
        permissions: ['geolocation'],
        geolocation: { latitude: 37.7749, longitude: -122.4194 }, // San Francisco, CA
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
      },
    },
  ],

  /* Expect configuration */
  expect: {
    timeout: 10000,
  },

  /* Output directory for test artifacts */
  outputDir: 'test-results/',
});