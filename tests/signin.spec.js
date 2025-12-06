const {test, expect}=require('@playwright/test');

test("Sign in & Sign Up Page for Yosuite", async ({browser})=> {

//chromoe browser invoke including cookies or plugins 
const context=await browser.newContext();
const page=await context.newPage();


//to the yosuite signin page
await page.goto("https://app.yosuite.net/signin");
console.log(await page.title());
await expect(page).toHaveTitle("Sign In");
await page.click("a.link[href='signup.html']");
console.log(await page.title());
await expect(page).toHaveTitle("Sign Up - YoSuite");

const slug="testmehedi";
const email="testmehedi@mailinator.com";
const password="Mehedi@123";


await page.locator("#signup_first_name").type("Mehedi");
await page.locator("#signup_last_name").type("Hasan");
await page.locator("#signup_email").type(email);
await page.fill("#signup_company_name", "Mehedi Ltd");
await page.fill("#signup_slug", slug);
await page.locator("#signup_type_of_company").click();
await page.waitForSelector('.ant-select-item-option');
await page.click('.ant-select-item-option >> text=Technology');

await page.locator("#signup_company_size").click();
await page.waitForSelector('.ant-select-item-option');
await page.click('.ant-select-item-option >> text=1-25');

await page.fill("#signup_password", password);
await page.locator("[type='submit']").click();
/*
await page.locator("#email").type("tirakej174@besenica.com");
await page.locator("#password").type("Mehedi@123");
await page.locator("[type='submit']").click();
*/
} );
