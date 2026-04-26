require('dotenv').config();

const { test } = require('@playwright/test');
const SignInPage = require('../pages/SignInPage');

test("User Sign In Flow", async ({ page }) => {

  const signInPage = new SignInPage(page);

  const email = "kemonec347@lawior.com";
  const password = "Mehedi@1234";

  // Step 1: Login and verify Home dashboard
  await signInPage.login(email, password);

  // Step 2: Wait 5 seconds then test passes
  await page.waitForTimeout(5000);

});