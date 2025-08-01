import { test, expect } from '@playwright/test';

// Test data configuration
const TEST_DATA = {
  address: {
    searchTerm: 'california',
    selection: 'California 1Malibu, CA, USA'
  },
  homeDetails: {
    purchaseMonth: 'January',
    purchaseDay: '01',
    purchaseYear: '2007'
  },
  insurance: {
    currentProvider: 'Allstate'
  },
  personalInfo: {
    firstName: 'automation',
    lastName: 'qa',
    email: 'automation_qa@moneygeek.com'
  }
} as const;

// Page Object Model approach for better maintainability
class HomeInsuranceQuotePage {
  constructor(private page: any) {}

  async navigateToQuotePage() {
    await this.page.goto('https://www.moneygeek.com/insurance/home/compare-quotes/homeowner');
  }

  async validateHomeownershipSection() {
    await expect(this.page.getByRole('heading', { name: 'Do you currently own your' })).toBeVisible();
    await expect(this.page.locator('label').filter({ hasText: 'Yes' })).toBeVisible();
    await expect(this.page.locator('label').filter({ hasText: 'No' })).toBeVisible();
  }

  async selectHomeownership() {
    await this.page.locator('label').filter({ hasText: 'Yes' }).first().click();
  }

  async validateAddressSection() {
    await expect(this.page.getByRole('heading', { name: 'What\'s your street address?' })).toBeVisible();
    await expect(this.page.getByText('Full AddressStart typing your')).toBeVisible();
    await expect(this.page.getByText('Full AddressStart typing your address and select from the listContinueYour')).toBeVisible();
  }

  async enterAddress(searchTerm: string, selection: string) {
    const addressInput = this.page.getByRole('textbox', { name: 'Enter an address' });
    await addressInput.click();
    
    // Clear any existing text first
    await addressInput.clear();
    
    // Type slowly to trigger the autocomplete dropdown
    await addressInput.type(searchTerm, { delay: 200 });
    
    // Wait a bit for the dropdown to populate
    await this.page.waitForTimeout(1000);
    
    // Try to wait for the specific option to appear with multiple strategies
    try {
      // Strategy 1: Wait for the text to be visible
      await this.page.waitForSelector(`text=${selection}`, { 
        state: 'visible', 
        timeout: 5000 
      });
      await this.page.getByText(selection).click();
    } catch (error) {
      // Strategy 2: Look for partial text match in case exact text doesn't work
      try {
        await this.page.waitForSelector('text=California', { 
          state: 'visible', 
          timeout: 3000 
        });
        // Click the first California option that appears
        await this.page.locator('text=California').first().click();
      } catch (secondError) {
        // Strategy 3: Look for the dropdown container and click first option
        try {
          await this.page.waitForSelector('.pac-container', { 
            state: 'visible', 
            timeout: 3000 
          });
          await this.page.locator('.pac-item').first().click();
        } catch (thirdError) {
          // Strategy 4: If dropdown still doesn't appear, try typing more characters
          await addressInput.type(' malibu', { delay: 200 });
          await this.page.waitForTimeout(1000);
          await this.page.waitForSelector(`text=${selection}`, { 
            state: 'visible', 
            timeout: 5000 
          });
          await this.page.getByText(selection).click();
        }
      }
    }
  }

  async validateBirthdateSection() {
    await expect(this.page.getByRole('heading', { name: 'Select your birthdate.' })).toBeVisible();
    await expect(this.page.getByText('Insurers use your age to')).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^Month$/ }).nth(2)).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^Day$/ }).nth(2)).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^Year$/ }).nth(2)).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: 'Select your birthdate.' }).nth(3)).toBeVisible();
  }

  async selectPurchaseDate(month: string, day: string, year: string) {
    // Month selection
    await this.page.locator('.css-1fyp00r-control').first().click();
    await this.page.getByText(month).click();
    
    // Day selection
    await this.page.getByRole('option', { name: day }).locator('div').first().click();
    
    // Year selection
    await this.page.getByText(year).click();
  }

  async validateCurrentInsuranceSection() {
    await expect(this.page.getByRole('heading', { name: 'Are you currently insured?' })).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^YesI currently have insurance$/ }).first()).toBeVisible();
    await expect(this.page.locator('label').filter({ hasText: 'NoI either don\'t have or' })).toBeVisible();
  }

  async selectCurrentInsurance(provider: string) {
    await this.page.locator('label').filter({ hasText: 'YesI currently have insurance' }).click();
  }

  async validateInsuranceProviderSection() {
    await expect(this.page.getByRole('heading', { name: 'Who are you currently insured' })).toBeVisible();
    await expect(this.page.locator('label').filter({ hasText: 'Allstate' })).toBeVisible();
    await expect(this.page.locator('label').filter({ hasText: 'State Farm' })).toBeVisible();
    await expect(this.page.locator('label').filter({ hasText: 'USAA' })).toBeVisible();
    await expect(this.page.locator('label').filter({ hasText: 'Liberty Mutual' })).toBeVisible();
    await expect(this.page.locator('label').filter({ hasText: 'Farmer Insurance' })).toBeVisible();
    await expect(this.page.locator('label').filter({ hasText: 'Travelers Insurance' })).toBeVisible();
    await expect(this.page.locator('label').filter({ hasText: 'OtherMy insurer is not listed' })).toBeVisible();
  }

  async selectInsuranceProvider(provider: string) {
    await this.page.locator('div').filter({ hasText: new RegExp(`^${provider}$`) }).first().click();
  }

  async validateSpouseSection() {
    await expect(this.page.getByRole('heading', { name: 'Do you have a spouse or' })).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^Yes$/ }).first()).toBeVisible();
    await expect(this.page.locator('label').filter({ hasText: 'No' })).toBeVisible();
  }

  async confirmContinuousInsurance() {
    await this.page.locator('label').filter({ hasText: 'Yes' }).click();
  }

  async validatePersonalInfoSection() {
    await expect(this.page.getByRole('heading', { name: 'What\'s your name?' })).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^First Name$/ }).first()).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^Last Name$/ }).first()).toBeVisible();
    await expect(this.page.getByText('Your information is safe &')).toBeVisible();
  }

  async fillPersonalInfo(firstName: string, lastName: string) {
    await this.page.getByRole('textbox').first().fill(firstName);
    await this.page.getByRole('textbox').nth(1).fill(lastName);
  }

  async validateEmailSection() {
    await expect(this.page.getByRole('heading', { name: 'What\'s your email address?' })).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^Email Address$/ }).first()).toBeVisible();
    await expect(this.page.getByText('By submitting, I understand')).toBeVisible();
    await expect(this.page.getByText('Your information is safe &')).toBeVisible();
  }

  async fillEmail(email: string) {
    await this.page.getByRole('textbox').fill(email);
  }

  async clickContinue() {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async clickSeeMatches() {
    await this.page.getByRole('button', { name: 'See my matches' }).click();
  }

  async validateResultsPage() {
    await expect(this.page.getByRole('heading', { name: 'Compare your home insurance' })).toBeVisible();
    await this.page.getByText('Click on multiple offers to').click();
    await expect(this.page.getByText('1', { exact: true })).toBeVisible();
    await expect(this.page.getByRole('img', { name: 'Progressive' })).toBeVisible();
    await expect(this.page.locator('.flex.flex-col.gap-\\[4px\\].pt-\\[5px\\]').first()).toBeVisible();
    await expect(this.page.getByText('Best Overall').nth(1)).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Progressive' })).toBeVisible();
    await expect(this.page.getByText('Home insurance protects your')).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^Get QuotesOn Progressive site$/ }).getByRole('button')).toBeVisible();
    await expect(this.page.getByText('On Progressive site')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Show more' })).toBeVisible();
    await expect(this.page.getByText('Here\'s what happens next:1.')).toBeVisible();
    await expect(this.page.getByRole('img', { name: 'Compare Home Insurance' })).toBeVisible();
    await expect(this.page.locator('.flex.items-center.justify-center.w-\\[125px\\]')).toBeVisible();
    await expect(this.page.getByText('Speak with an agent(844) 635-')).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: 'Disclaimer: MoneyGeek is' }).nth(2)).toBeVisible();
  }
}

test.describe('Home Insurance Quote Flow with Validations', () => {
  test('should complete home insurance quote form with element validations at each step', async ({ page }) => {
    const quotePage = new HomeInsuranceQuotePage(page);

    // Step 1: Navigate to quote page
    await quotePage.navigateToQuotePage();
    
    // Step 2: Validate and select homeownership status
    await quotePage.validateHomeownershipSection();
    await quotePage.selectHomeownership();
    
    // Step 3: Validate address section and enter address
    await quotePage.validateAddressSection();
    await quotePage.enterAddress(TEST_DATA.address.searchTerm, TEST_DATA.address.selection);
    await quotePage.clickContinue();
    
    // Step 4: Validate birthdate section and select purchase date
    await quotePage.validateBirthdateSection();
    await quotePage.selectPurchaseDate(
      TEST_DATA.homeDetails.purchaseMonth,
      TEST_DATA.homeDetails.purchaseDay,
      TEST_DATA.homeDetails.purchaseYear
    );
    
    // Step 5: Validate and select current insurance status
    await quotePage.validateCurrentInsuranceSection();
    await quotePage.selectCurrentInsurance(TEST_DATA.insurance.currentProvider);
    
    // Step 6: Validate insurance provider section and select provider
    await quotePage.validateInsuranceProviderSection();
    await quotePage.selectInsuranceProvider(TEST_DATA.insurance.currentProvider);
    
    // Step 7: Validate spouse section and confirm continuous insurance
    await quotePage.validateSpouseSection();
    await quotePage.confirmContinuousInsurance();
    
    // Step 8: Validate personal info section and fill details
    await quotePage.validatePersonalInfoSection();
    await quotePage.fillPersonalInfo(
      TEST_DATA.personalInfo.firstName,
      TEST_DATA.personalInfo.lastName
    );
    await quotePage.clickContinue();
    
    // Step 9: Validate email section and fill email
    await quotePage.validateEmailSection();
    await quotePage.fillEmail(TEST_DATA.personalInfo.email);
    await quotePage.clickSeeMatches();
    
    // Step 10: Validate results page elements
    await quotePage.validateResultsPage();
  });
});

// Configuration for better test reliability
test.beforeEach(async ({ page }) => {
  // Set longer timeout for navigation
  page.setDefaultNavigationTimeout(30000);
  page.setDefaultTimeout(15000);
});

test.afterEach(async ({ page }) => {
  // Clean up if needed
  await page.close();
});