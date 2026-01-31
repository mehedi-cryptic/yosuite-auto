require('dotenv').config();
const { test,expect } = require('@playwright/test');
const SignUpPage = require('../pages/signUpPage');

test("sign up flow", async({browser})=>{

const context=await browser.newContext();
const page=await context.newPage();
const signUpPage=new SignUpPage(page);

const uniqueShortId=MATH.random().toString(36).substring(2,8);
const userData = {
    firstName: "Mehedi",
    lastName: "Hasan",
    email: `mehedi${uniqueShortId}@inbox.testmail.app`, 
    companyName: "Mehedi Ltd",
    slug: `test${uniqueShortId}`, 
    companyType: "Technology",
    companySize: "1-25",
    password: process.env.TEST_PASSWORD 
  };
  console.log("🎯 Using Email:", userData.email);
  console.log("🎯 Using Slug:", userData.slug);

  // Execute the complete sign-up flow using the page object
  await signUpPage.signUp(userData);

  // Log success message
  console.log("✅ Sign up completed successfully!");
  
  // Optional: Navigate back to sign-in page
  await page.goto("https://app.yosuite.net/signin");
  await expect(page).toHaveTitle("Sign In");
  console.log("✅ Navigated back to Sign In page");

});