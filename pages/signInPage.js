const { expect } = require('@playwright/test');

class SignInPage {

  constructor(page) {
    this.page = page;
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.submitButton = page.locator("[type='submit']");
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
    // Wait for URL to change away from signin with long timeout
    await this.page.waitForURL(
      url => !url.toString().includes('signin'),
      { timeout: 60000 }
    );
    // Wait extra time for session to fully establish
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