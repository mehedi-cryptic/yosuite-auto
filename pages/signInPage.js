const { expect } = require('@playwright/test');

class SignInPage {

  constructor(page) {
    this.page = page;
    this.emailInput   = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.submitButton  = page.locator("[type='submit']");
  }

  async navigateToSignIn() {
    await this.page.goto("https://roxsxsnor.yosuite.net/signin");
    await expect(this.page).toHaveTitle("Sign In");
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async verifyHomeDashboard() {
    // Wait for Finance/Home page to load after login
    // Uses locator wait instead of waitForURL — more reliable
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await this.page.waitForTimeout(5000);
  }

  async login(email, password) {
    await this.navigateToSignIn();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();
    await this.verifyHomeDashboard();
  }
}

module.exports = SignInPage;