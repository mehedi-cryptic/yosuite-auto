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

const updatedData = {
  loanAmount:           "2000",
  interestRate:         "12",
  numberOfInstallments: "6",
};

const installment1 = {
  amount:         "100",
  acknowledgedBy: "Mehedi",
  note:           "First installment payment",
};

const installment2 = {
  amount:         "150",
  acknowledgedBy: "Mehedi",
  note:           "Second installment payment",
};

test("Finance - Full Loan Management Flow", async ({ page }) => {

  const signInPage  = new SignInPage(page);
  const financePage = new FinancePage(page);

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
  console.log("✅ Step 3: First loan added:", loanData1.code);

  await page.waitForTimeout(2000);

  // ── STEP 4: Add Second Loan Record ──────────────────────────────────────
  await financePage.clickAddNew();
  await financePage.fillLoanForm(loanData2);
  await financePage.assertFormFields(loanData2);
  await financePage.saveLoanForm();
  await financePage.verifySavedInTable(loanData2);
  console.log("✅ Step 4: Second loan added:", loanData2.code);

  await page.waitForTimeout(2000);

  // ── STEP 5: Click 3 dot menu on row 0 ───────────────────────────────────
  await financePage.clickRowActionMenu(0);
  console.log("✅ Step 5: Clicked 3 dot menu on row 0");

  // ── STEP 6: Delete and verify ────────────────────────────────────────────
  await financePage.clickDelete();
  await financePage.verifyDeletedFromTable(loanData1);
  console.log("✅ Step 6: Deleted and verified");

  await page.waitForTimeout(2000);

  // ── STEP 7: Edit remaining loan ──────────────────────────────────────────

  // Case 1: Click 3 dot menu
  await financePage.clickRowActionMenu(0);
  console.log("✅ Step 7 Case 1: Clicked 3 dot menu");

  // Case 2: Click Edit
  await financePage.clickEdit();
  console.log("✅ Step 7 Case 2: Clicked Edit");

  // Case 3: Update fields and assert
  await financePage.updateLoanFields(updatedData);
  await financePage.assertUpdatedFields(updatedData);
  console.log("✅ Step 7 Case 3: Updated and asserted fields");

  // Case 4: Assert Employee Installments table visible
  await financePage.assertInstallmentsTableVisible();
  console.log("✅ Step 7 Case 4: Installments table visible");

  // Case 5: Save and verify in table
  await financePage.saveAndVerifyInTable(updatedData);
  console.log("✅ Step 7 Case 5: Saved and verified updated loan");

  await page.waitForTimeout(2000);

  // ── STEP 8: View loan and manage Employee Installments ───────────────────

  // Case 1: Click 3 dot menu on row 0
  await financePage.clickRowActionMenu(0);
  console.log("✅ Step 8 Case 1: Clicked 3 dot menu");

  // Case 2: Click View
  await financePage.clickView();
  console.log("✅ Step 8 Case 2: Clicked View");

  // Case 3: Assert View dialog details
  await financePage.assertViewDialogDetails();
  console.log("✅ Step 8 Case 3: Asserted View dialog details");

  // Case 4: Click Add New in Employee Installments
  await financePage.clickInstallmentsAddNew();
  console.log("✅ Step 8 Case 4: Clicked Add New installment");

  // Case 5: Fill installment 1
  await financePage.fillInstallmentForm(installment1);
  console.log("✅ Step 8 Case 5: Filled installment 1");

  // Case 6: Save installment 1
  await financePage.saveInstallmentForm();
  console.log("✅ Step 8 Case 6: Saved installment 1");

  // Case 7: Verify installment 1 in table
  await financePage.verifyInstallmentInTable(installment1);
  console.log("✅ Step 8 Case 7: Verified installment 1 in table");

  await page.waitForTimeout(1000);

  // Case 8: Add second installment
  await financePage.clickInstallmentsAddNew();
  await financePage.fillInstallmentForm(installment2);
  await financePage.saveInstallmentForm();
  await financePage.verifyInstallmentInTable(installment2);
  console.log("✅ Step 8 Case 8: Added and verified installment 2");

  await page.waitForTimeout(2000);

  // Case 9: Edit installment row 0
  await financePage.editInstallment(0, "200");
  console.log("✅ Step 8 Case 9: Edited installment to 200");

  await page.waitForTimeout(2000);

  // Case 10: Delete installment row 0
  await financePage.deleteInstallment(0);
  console.log("✅ Step 8 Case 10: Deleted installment row 0");

  await page.waitForTimeout(2000);

  // Case 11: View remaining installment row 0 and return
  await financePage.viewInstallmentAndReturn(0);
  console.log("✅ Step 8 Case 11: Viewed installment and returned");

  // Case 12: Assert Installment History
  await financePage.assertInstallmentHistory();
  console.log("✅ Step 8 Case 12: Asserted Installment History");

  // Case 13: Close dialog and go back to Finance table
  await financePage.closeDialogAndGoToTable();
  console.log("✅ Step 8 Case 13: Closed dialog, back to Finance table");

  // Final wait
  await page.waitForTimeout(5000);
  console.log("✅ All steps completed successfully!");

});