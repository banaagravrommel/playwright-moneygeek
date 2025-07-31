import { test, expect, chromium } from '@playwright/test';

test('US Location Simulation - Homeowner Insurance Quote Flow', async () => {
  // Launch browser with US geolocation and custom user agent
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    locale: 'en-US',
    permissions: ['geolocation'],
    geolocation: { latitude: 37.7749, longitude: -122.4194 }, // San Francisco, CA
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',

    /*
    // Optional Proxy (uncomment to enable)
    proxy: {
      server: 'https://174.138.54.65:80'
    }
    */
  });

  const page = await context.newPage();

  // Navigate to homeowner insurance quote page
  await page.goto('https://www.moneygeek.com/insurance/home/compare-quotes/homeowner');
  await expect(page.getByRole('heading', { name: 'Do you currently own your' })).toBeVisible();

  // Select "Yes" for home ownership
  await page.locator('label:has-text("Yes")').click();

  // Address input
await expect(page.getByRole('heading', { name: 'What\'s your street address?' })).toBeVisible();

const addressInput = page.getByRole('textbox', { name: 'Enter an address' });

// Simulate slow typing
await addressInput.click();
await addressInput.type('California', { delay: 200 }); // 200ms delay between keystrokes

// Wait for suggestions to appear and select one
await expect(page.getByText('California 1Malibu, CA, USA')).toBeVisible();
await page.getByText('California 1Malibu, CA, USA').click();
await page.getByRole('button', { name: 'Continue' }).click();

  
  // await page.getByText('California 1Malibu, CA, USA').click();
  // await page.getByRole('button', { name: 'Continue' }).click();

  // Birthdate selection
  await expect(page.getByRole('heading', { name: 'Select your birthdate.' })).toBeVisible();
  await page.locator('.css-1fyp00r-control > div:nth-child(2)').first().click();
  await page.getByText('January').click();      // Select Month
  await page.getByRole('option', { name: '01' }).locator('div').first().click(); // Day
  await page.getByText('2007').click();         // Year

  // Insurance status
  await expect(page.getByRole('heading', { name: 'Are you currently insured?' })).toBeVisible();
  await page.locator('label:has-text("YesI currently have insurance")').click();

  // Insurance provider
  await expect(page.getByRole('heading', { name: 'Who are you currently insured' })).toBeVisible();
  await page.locator('label:has-text("Allstate")').click();

  // Marital status
  await expect(page.getByRole('heading', { name: 'Do you have a spouse or' })).toBeVisible();
  await page.locator('label:has-text("Yes")').click();

  // Name entry
  await expect(page.getByRole('heading', { name: 'What\'s your name?' })).toBeVisible();
  await page.getByRole('textbox').nth(0).fill('automation'); // First Name
  await page.getByRole('textbox').nth(1).fill('testing');    // Last Name
  await page.getByRole('button', { name: 'Continue' }).click();

  // Email entry
  await expect(page.getByRole('heading', { name: 'What\'s your email address?' })).toBeVisible();
  await page.getByRole('textbox').fill('automation_testing@moneygeek.com');
  await page.getByRole('button', { name: 'See my matches' }).click();

  // Final Page - Insurance Results
  await expect(page.getByRole('heading', { name: 'Compare your home insurance' })).toBeVisible();
  await expect(page.getByText('Click on multiple offers to')).toBeVisible();
  await expect(page.getByText('1', { exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: 'National Home Quotes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'National Home Quotes' })).toBeVisible();
 // await expect(page.getByText('Get Free Quotes for Home')).toBeVisible();

  await expect(page.getByRole('button', { name: 'quote-icon Get Quotes' })).toBeVisible();
  await expect(page.getByText('On National Home Quotes site')).toBeVisible();
  await expect(page.getByText('Here\'s what happens next:1.')).toBeVisible();
  await expect(page.locator('.flex.flex-col.md\\:flex-row.md\\:gap-\\[16px\\]')).toBeVisible();
  await expect(page.getByRole('img', { name: 'moneygeek - Find You' }).first()).toBeVisible();
  await expect(page.getByText('Speak with an agent(844) 635-')).toBeVisible();
  await expect(page.locator('div:has-text("Disclaimer: MoneyGeek is")').nth(2)).toBeVisible();
});
