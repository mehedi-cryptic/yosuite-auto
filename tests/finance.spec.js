require('dotenv').config();

const { test } = require('@playwright/test');
const SignInPage = require('../pages/SignInPage');
const FinancePage = require('../pages/FinancePage');

const loanData = {
  employee:             "Mehedi",
  code:                 "LOAN-001",   // max 8 characters
  dateOfApproval:       "2026-04-26",
  dateOfDisbursement:   "2026-04-26",
  repaymentStarts:      "2026-05-01",
  currency:             "United States Dollar",
  loanAmount:           "1000",
  interestRate:         "10",
  totalPayable:         "1100",
  numberOfInstallments: "5",
  amountPerInstallment: "220",
  installmentPeriod:    "1",
  status:               "Open",
};

test("Finance - Add New Loan Record", async ({ page }) => {

  const signInPage = new SignInPage(page);
  const financePage = new FinancePage(page);

  // Login
  await signInPage.login("kemonec347@lawior.com", "Mehedi@1234");

  // Navigate to Finance
  await financePage.navigateToFinance();

  // Click Add New
  await financePage.clickAddNew();

  // Fill form
  await financePage.fillLoanForm(loanData);

  // Assert fields
  await financePage.assertFormFields(loanData);

  // Save
  await financePage.saveLoanForm();

  // Verify in table
  await financePage.verifySavedInTable(loanData);

  // Wait 5 seconds
  await page.waitForTimeout(5000);

});