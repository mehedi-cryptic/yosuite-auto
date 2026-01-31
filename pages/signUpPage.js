const {expect} = require('@playwright/test');

class SignUpPage{
    constructor(page){
        this.page = page;
        this.firstNameInput = page.locator("#signup_first_name");
        this.lastNameInput = page.locator("#signup_last_name"); // ✅ Fixed typo: lasNameInput → lastNameInput
        this.emailInput = page.locator("#signup_email");
        this.companyNameInput = page.locator("#signup_company_name");
        this.slugInput = page.locator("#signup_slug");
        this.companyTypeDropdown = page.locator("#signup_type_of_company");
        this.companySizeDropdown = page.locator("#signup_company_size");
        this.passwordInput = page.locator("#signup_password");
        this.submitButton = page.locator("[type='submit']");
        this.checkEmailText = page.getByText("Check your email");
    }

    // Method to get in the sign up page
    async navigateToSignUp(){
        await this.page.goto("https://app.yosuite.net/signin");
        await this.page.click("a.link[href='signup.html']");
        await expect(this.page).toHaveTitle("Sign Up - YoSuite");
    }

    // Method to fill up the sign up form
    async fillSignUpForm(firstName, lastName, email, companyName, slug, password){
        await this.firstNameInput.type(firstName);
        await this.lastNameInput.type(lastName); // ✅ Fixed: lasNameInput → lastNameInput
        await this.emailInput.type(email);
        await this.companyNameInput.type(companyName);
        await this.slugInput.type(slug);
        await this.passwordInput.type(password);
    }

    // Method to select company type
    async selectCompanyType(type){
        await this.companyTypeDropdown.click();
        await this.page.waitForSelector('.ant-select-item-option');
        await this.page.click(`.ant-select-item-option >> text=${type}`);
    }

    // Method to select company size
    async selectCompanySize(size){
        await this.companySizeDropdown.click();
        await this.page.waitForSelector('.ant-select-item-option');
        await this.page.click(`.ant-select-item-option >> text=${size}`);
    }

    async submitForm(){
        await this.submitButton.click();
    }

    // Method to verify sign up
    async verifySignUp(){
        await expect(this.page).toHaveTitle("Verify Sign Up - YoSuite"); // ✅ Fixed title
        await expect(this.checkEmailText).toBeVisible();
    }

    // ✅ FIXED: Changed from SignUp to signUp (lowercase 's')
    async signUp(userData){
        await this.navigateToSignUp();
        await this.fillSignUpForm(
            userData.firstName, 
            userData.lastName, 
            userData.email, 
            userData.companyName, 
            userData.slug, 
            userData.password
        );
        await this.selectCompanyType(userData.companyType);
        await this.selectCompanySize(userData.companySize);
        await this.submitForm();
        await this.verifySignUp();
    }
}

module.exports = SignUpPage;