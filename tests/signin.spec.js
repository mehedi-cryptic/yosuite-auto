const {test, expect}=require('@playwright/test');

test("Sign in Page for Yosuite", async ({browser})=> {

//chromoe browser invoke including cookies or plugins 
const context=await browser.newContext();
const page=await context.newPage();


//to the yosuite signin page
await page.goto("https://app.yosuite.net/signin");

//get title and put assertion to see it correct
console.log(await page.title());
await expect(page).toHaveTitle("Sign In");

await page.locator("#email").type("tirakej174@besenica.com");
await page.locator("#password").type("Mehedi@123");
await page.locator("[type='submit']").click();

} );
