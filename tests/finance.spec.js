require('dotenv').config();

const { test } = require('@playwright/test');
const SignInPage  = require('../pages/SignInPage');
const FinancePage = require('../pages/FinancePage');

// Generate unique loan data each run
function generateLoanData() {
  const random      = Math.floor(Math.random() * 900) + 100;
  const today       = new Date().toISOString().split('T')[0];
  const nextMonth   = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const repaymentDate        = nextMonth.toISOString().split('T')[0];
  const loanAmount           = Math.floor(Math.random() * 4500) + 500;
  const interestRate         = 10;
  const totalPayable         = Math.round(loanAmount * 1.1);
  const numberOfInstallments = 5;
  const installmentPeriod    = 1;

  return {
    employee:             "Mehedi",
    code:                 `LN-${random}`,
    dateOfApproval:       today,
    dateOfDisbursement:   today,
    repaymentStarts:      repaymentDate,
    currency:             "United States Dollar",
    loanAmount:           String(loanAmount),
    interestRate:         String(interestRate),
    totalPayable:         String(totalPayable),
    numberOfInstallments: String(numberOfInstallments),
    amountPerInstallment: String(Math.round(totalPayable / numberOfInstallments)),
    installmentPeriod:    String(installmentPeriod),
    status:               "Open",
  };
}

// Updated data for edit step
const updatedData = {
  loanAmount:           "2000",
  interestRate:         "12",
  numberOfInstallments: "6",
};

test("Finance - Full Loan Management Flow", async ({ page }) => {

  const signInPage  = new SignInPage(page);
  const financePage = new FinancePage(page);

  // Generate two separate loan records
  const loanData1 = generateLoanData();
  const loanData2 = generateLoanData();

  console.log("Loan 1:", loanData1);
  console.log("Loan 2:", loanData2);

  // ── STEP 1: Login once ──────────────────────────────────────────────────
  await signInPage.login("kemonec347@lawior.com", "Mehedi@1234");
  console.log("✅ Step 1: Logged in");

  // ── STEP 2: Navigate to Finance ─────────────────────────────────────────
  await financePage.navigateToFinance();
  console.log("✅ Step 2: Navigated to Finance");

  // ── STEP 3: Add First Loan Record ───────────────────────────────────────
  await financePage.clickAddNew();
  await financePage.fillLoanForm(loanData1);
  await financePage.assertFormFields(loanData1);
  await financePage.saveLoanForm();
  await financePage.verifySavedInTable(loanData1);
  console.log("✅ Step 3: First loan added and verified:", loanData1.code);

  await page.waitForTimeout(2000);

  // ── STEP 4: Add Second Loan Record ──────────────────────────────────────
  await financePage.clickAddNew();
  await financePage.fillLoanForm(loanData2);
  await financePage.assertFormFields(loanData2);
  await financePage.saveLoanForm();
  await financePage.verifySavedInTable(loanData2);
  console.log("✅ Step 4: Second loan added and verified:", loanData2.code);

  await page.waitForTimeout(2000);

  // ── STEP 5 & 6: Delete First Loan (row 0 = most recently added first) ───
  // Click 3 dot menu on first row
  await financePage.clickRowActionMenu(0);
  console.log("✅ Step 5: Clicked 3 dot action menu");

  // Click Delete and confirm
  await financePage.clickDelete();
  console.log("✅ Step 6: Deleted first loan record");

  // Go back to table and verify it's deleted
  await financePage.verifyDeletedFromTable(loanData1);
  console.log("✅ Step 6: Verified first loan deleted from table");

  await page.waitForTimeout(2000);

  // ── STEP 7: Edit remaining loan record ──────────────────────────────────

  // Case 1: Click 3 dot menu on first remaining row
  await financePage.clickRowActionMenu(0);
  console.log("✅ Case 1: Clicked 3 dot action menu");

  // Case 2: Click Edit
  await financePage.clickEdit();
  console.log("✅ Case 2: Clicked Edit");

  // Case 3: Update fields and assert
  await financePage.updateLoanFields(updatedData);
  await financePage.assertUpdatedFields(updatedData);
  console.log("✅ Case 3: Updated and asserted fields");

  // Case 4: Assert Employee Installments table visible
  await financePage.assertInstallmentsTableVisible();
  console.log("✅ Case 4: Employee Installments table is visible");

  // Case 5: Save and verify updated data in table
  await financePage.saveAndVerifyInTable(updatedData);
  console.log("✅ Case 5: Saved and verified updated data in table");

  // Wait 5 seconds before browser closes
  await page.waitForTimeout(5000);
  console.log("✅ All steps completed successfully!");

});