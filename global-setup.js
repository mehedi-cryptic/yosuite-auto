// global-setup.js
const { chromium } = require('@playwright/test');
const SignInPage = require('./pages/SignInPage');
const fs = require('fs');

module.exports = async () => {

  // Create auth folder if it doesn't exist
  if (!fs.existsSync('./auth')) {
    fs.mkdirSync('./auth');
  }

  // Launch in headed mode to see what's happening
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const signInPage = new SignInPage(page);

  const email = "kemonec347@lawior.com";
  const password = "Mehedi@1234";

  console.log('🔐 Running global setup: Logging in...');

  await signInPage.login(email, password);
  await context.storageState({ path: './auth/session.json' });

  console.log('✅ Session saved to auth/session.json');

  await browser.close();
};