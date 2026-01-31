require('dotenv').config();

// Import Playwright test functions
const { test, expect } = require('@playwright/test');

// Import the SignInPage class
const SignInPage = require('../pages/SignInPage');

// Define a test case for sign-in
test("User Sign In Flow", async ({browser}) => {
  
  // Create browser context
  const context = await browser.newContext();
  
  // Create new page
  const page = await context.newPage();
  
  // Create instance of SignInPage
  const signInPage = new SignInPage(page);

  // Fixed credentials for login
  const email = "kemonec347@lawior.com";
  const password = "Mehedi@123";

  // Log the credentials being used
  console.log("🔐 Logging in with:", email);

  // Execute the complete login flow
  await signInPage.login(email, password);

  // Log success
  console.log("✅ Successfully logged in!");
});