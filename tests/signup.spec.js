require('dotenv').config();
const { test, expect } = require('@playwright/test');
const axios = require('axios'); // Note: no curly braces for axios

test("Sign in & Sign Up Page for Yosuite", async ({browser}) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://app.yosuite.net/signin");
  await expect(page).toHaveTitle("Sign In");
  await page.click("a.link[href='signup.html']");
  console.log(await page.title());
  await expect(page).toHaveTitle("Sign Up - YoSuite");

  const uniqueShortId = Math.random().toString(36).substring(2, 8);
  const uniqueEmail = `mehedi${uniqueShortId}@inbox.testmail.app`;
  const uniqueSlug = `test${uniqueShortId}`;
  const password = process.env.TEST_PASSWORD; 

  await page.locator("#signup_first_name").type("Mehedi");
  await page.locator("#signup_last_name").type("Hasan");
  await page.locator("#signup_email").type(uniqueEmail);
  await page.fill("#signup_company_name", "Mehedi Ltd");
  await page.fill("#signup_slug", uniqueSlug);
  await page.locator("#signup_type_of_company").click();
  await page.waitForSelector('.ant-select-item-option');
  await page.click('.ant-select-item-option >> text=Technology');

  await page.locator("#signup_company_size").click();
  await page.waitForSelector('.ant-select-item-option');
  await page.click('.ant-select-item-option >> text=1-25');

  await page.fill("#signup_password", password);
  await page.locator("[type='submit']").click();

  await expect(page).toHaveTitle("Sign Up - YoSuite");
  await expect(page.getByText("Check your email")).toBeVisible();

  await page.goto("https://roxsxsnor.yosuite.net/");
  await expect.page.toHaveTitle("Sign In");
  



});