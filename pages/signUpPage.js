const {expect} =require('@playwright/test');

class SignUpPage{
    constructor(page){
      
        this.page=page;
        this.firstNameInput=page.locator("#signup_first_name");
        this.lasNameInput=page.locator("#signup_last_name");
        this.emailInput=page.locator("#signup_email");
        this.companyNameInput=page.locator("#signup_company_name");
        this.slugInput=page.locator("#signup_slug");
        this.companyTypeDropdown=page.locator("#signup_type_of_company");
        this.companySizeDropdown=page.locator("#signup_company_size");
        this.passwordInput=page.locator("#signup_password");
        this.submitButton=page.locator("[type='submit']");
        this.checkEmailText=page.getByText("Check your email");

    }

//method to get in the sign up page
async navigateToSignUp(){

    await this.page.goto("https://app.yosuite.net/signin");
    await this.page.click("a.link[href='signup.html']");
    await expect(this.page).toHaveTitle("Sign Up - YoSuite");
}

//method to fill up the sign up form
async fillSignUpForm(firstName, lastName, email, companyName, slug, password){
    await this.firstNameInput.type(firstName);
    await this.lasNameInput.type(lastName);
    await this.emailInput.type(email);
    await this.companyNameInput.type(companyName);
    await this.slugInput.type(slug);
    await this.passwordInput.type(password);
}

//method to select company type
async selectCompanyType(type){
    await this.companyTypeDropdown.click();
    await this.page.waitForSelector('.ant-select-item-option');
    await this.page.click(`.ant-select-item-option >> text=${type}`);
}

//method to select company size
async selectCompanySize(size){
    await this.companySizeDropdown.click();
    await this.page.waitForSelector('.ant-select-item-option');
    await this.page.click(`.ant-select-item-option >> text=${size}`);
}
async submitForm(){
    await this.submitButton.click();
}

//method to verify sign up
async verifySignUp(){
    await expect(this.page).toHaveTitle("Sign Up - YoSuite");
    await expect(this.checkEmailText).toBeVisible();
}

//combine form
async SignUp(userData){
    await this.navigateToSignUp();
    await this.fillSignUpForm(userData.firstName, userData.lastName, userData.email, userData.companyName, userData.slug, userData.password);
    await this.selectCompanyType(userData.companyType);
    await this.selectCompanySize(userData.companySize);
    await this.submitForm();
    await this.verifySignUp();
}
}
module.exports={SignUpPage};