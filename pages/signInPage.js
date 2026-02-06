// Import expect for assertions
const { expect } = require('@playwright/test');

// Define the SignInPage class - represents the Sign In page
class SignInPage {
  
  // initializes the page object with locators
  constructor(page) {
    this.page = page; 
    
    // locators for sign-in page elements
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.submitButton = page.locator("[type='submit']");
  }

  // Method to navigate to the sign-in page
  async navigateToSignIn() {
    // Go to the sign-in URL
    await this.page.goto("https://app.yosuite.net/signin");
    // Verify we're on the sign-in page by checking title
    await expect(this.page).toHaveTitle("Sign In");
  }

  // Method to fill email field
  async fillEmail(email) {
    // Fill the email input with provided email
    await this.emailInput.fill(email);
  }

  // Method to fill password field
  async fillPassword(password) {
    // Fill the password input with provided password
    await this.passwordInput.fill(password);
  }

  // Method to click the submit/login button
  async clickSubmit() {
    // Click the submit button
    await this.submitButton.click();
  }

  // Method to verify successful login
  /*async verifyLoginSuccess() {
    // Check that URL contains either "dashboard" or "home"
    // This regex /dashboard|home/ means "dashboard OR home"
    await expect(this.page).toHaveURL();
  } */

  // Complete login flow - high-level method
  async login(email, password) {
    // Navigate to sign-in page
    await this.navigateToSignIn();
    // Fill email field
    await this.fillEmail(email);
    // Fill password field
    await this.fillPassword(password);
    // Click submit button
    await this.clickSubmit();
    // Verify successful login
    //await this.verifyLoginSuccess();
  }
}

// Export the class
module.exports = SignInPage;