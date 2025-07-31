import { test, expect, chromium } from '@playwright/test';

test('US location simulation test', async () => {
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    locale: 'en-US',
    permissions: ['geolocation'],
    geolocation: { latitude: 37.7749, longitude: -122.4194 }, // San Francisco, CA
    
    /* Proxy
    proxy: {
      server: 'https://174.138.54.65:80'  // US proxy
    },
    */

    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  await page.goto('https://www.moneygeek.com/insurance/auto/compare-quotes/currently-insured');
  await page.getByText('No, I don\'t have insurance').click();
  await page.getByText('No, my license is expired,').click();
  await page.getByText('No tickets or accidents').click();
  await page.getByText('2025', { exact: true }).click();
  await page.getByText('Acura').click();
  await page.getByText('Integra').click();
  await page.getByText('No, just one vehicle for now').click();
  await page.getByText('Excellent (720+)').click();
  await page.getByRole('button', { name: 'None apply to me' }).click();
  await page.getByText('No', { exact: true }).click();
  await page.getByText('Male', { exact: true }).click();
  await page.locator('.css-1fyp00r-control > div:nth-child(2)').first().click();
  await page.getByText('January').click();
  await page.getByRole('option', { name: '01' }).locator('div').first().click();
  await page.getByText('2007').click();
  await page.getByRole('textbox', { name: 'Enter an address' }).fill('test');
  await page.getByText('Continue').click();
  
  // Wait before filling personal info
  await page.waitForTimeout(1000);
  await page.getByRole('textbox').first().click();
  await page.getByRole('textbox').first().fill('first name');
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill('last name');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('textbox').fill('testqa@gmail.com');
  await page.getByRole('button', { name: 'See my matches' }).click();
  
  // Wait for results to load
  await page.waitForTimeout(5000);
  
  // Fixed: Changed page1 to page
  await expect(page.getByRole('heading', { name: 'Compare your car insurance' })).toBeVisible();
  await expect(page.getByText('Click on multiple offers to')).toBeVisible();
  await expect(page.getByText('1Best')).toBeVisible();
  await expect(page.getByRole('button', { name: 'quote-icon Get Quotes' })).toBeVisible();
  await expect(page.getByText('You are in good hands19')).toBeVisible();
  await expect(page.getByRole('img', { name: 'social-proof-banner' })).toBeVisible();

  // Optional: Close context when done
  await context.close();
});