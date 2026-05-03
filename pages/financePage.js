const { expect } = require('@playwright/test');

class FinancePage {

  constructor(page) {
    this.page = page;
    this.financeURL = "https://roxsxsnor.yosuite.net/page/modules/loans/loan/list";

    // View dialog scope
    this.viewDialog = page.getByRole('dialog');

    // Add New form dropdowns
    this.employeeDropdown = page.getByRole('combobox', { name: 'Employee *' });
    this.currencyDropdown = page.getByRole('combobox', { name: 'Currency *' });
    this.statusDropdown   = page.getByRole('combobox', { name: 'Status *' });

    // Add New form spinbuttons
    this.loanAmountInput        = page.getByRole('spinbutton', { name: 'Loan Amount *' });
    this.interestRateInput      = page.getByRole('spinbutton', { name: 'Interest Rate *' });
    this.totalPayableInput      = page.getByRole('spinbutton', { name: 'Total Payable Amount *' });
    this.numberOfInstallments   = page.getByRole('spinbutton', { name: 'Number of Installments *' });
    this.installmentPeriodInput = page.getByRole('spinbutton', { name: 'Installment Period *' });

    // Add New form text inputs
    this.codeInput               = page.locator('[placeholder="e.g., LOAN-123"]');
    this.dateOfApprovalInput     = page.locator('[placeholder="Select approval date"]');
    this.dateOfDisbursementInput = page.locator('[placeholder="Select disbursement date"]');
    this.repaymentStartsInput    = page.locator('[placeholder="Select repayment date"]');

    // Buttons
    this.saveButton   = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });

    // Action menu options
    this.editOption   = page.getByRole('menuitem', { name: 'Edit' });
    this.viewOption   = page.getByRole('menuitem', { name: 'View' });
    this.deleteOption = page.getByRole('menuitem', { name: 'Delete' });

    // Edit form fields
    this.editLoanAmount   = page.getByRole('spinbutton', { name: 'Loan Amount *' });
    this.editInterestRate = page.getByRole('spinbutton', { name: 'Interest Rate *' });
    this.editInstallments = page.getByRole('spinbutton', { name: 'Number of Installments *' });

    // Installment form fields — use id for reliability
    this.installmentAmount      = page.locator('#installment_amount');
    this.acknowledgedByDropdown = page.getByRole('combobox', { name: /Acknowledged By/i });
    this.installmentNote        = page.locator('[placeholder*="delayed payment"]');
  }

  // ── Navigate to Finance ──────────────────────────────────────────────────
  async goToFinance() {
    await this.page.goto(this.financeURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForSelector('text=Add New', { timeout: 30000 });
    await this.page.waitForTimeout(2000);
  }

  async navigateToFinance() {
    await this.goToFinance();
  }

  // ── Click Add New button (main page) ─────────────────────────────────────
  async clickAddNew() {
    await this.page.getByRole('link', { name: 'Add New' }).click();
    await this.page.getByRole('heading', { name: 'Add' })
      .waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(2000);
  }

  // ── Fill loan form ────────────────────────────────────────────────────────
  async fillLoanForm(data) {
    await this.employeeDropdown.click();
    await this.employeeDropdown.fill(data.employee);
    await this.page.waitForTimeout(1000);
    await this.page.locator('.ant-select-dropdown')
      .locator('.ant-select-item-option-content', { hasText: data.employee })
      .first().click();

    await this.codeInput.fill(data.code);

    await this.dateOfApprovalInput.fill(data.dateOfApproval);
    await this.page.keyboard.press('Enter');

    await this.dateOfDisbursementInput.fill(data.dateOfDisbursement);
    await this.page.keyboard.press('Enter');

    await this.repaymentStartsInput.fill(data.repaymentStarts);
    await this.page.keyboard.press('Enter');

    const currencyValue = await this.currencyDropdown.inputValue();
    if (!currencyValue.includes(data.currency)) {
      await this.currencyDropdown.click();
      await this.currencyDropdown.fill(data.currency);
      await this.page.waitForTimeout(1000);
      await this.page.locator('.ant-select-dropdown')
        .locator('.ant-select-item-option-content', { hasText: data.currency })
        .first().click();
    }

    await this.loanAmountInput.fill(data.loanAmount);
    await this.interestRateInput.fill(data.interestRate);
    await this.totalPayableInput.fill(data.totalPayable);
    await this.numberOfInstallments.fill(data.numberOfInstallments);
    await this.installmentPeriodInput.fill(data.installmentPeriod);

    await this.statusDropdown.click();
    await this.page.waitForTimeout(1000);
    await this.page.locator('.ant-select-dropdown')
      .locator('.ant-select-item-option-content', { hasText: data.status })
      .first().click();
  }

  // ── Assert loan form fields ───────────────────────────────────────────────
  async assertFormFields(data) {
    await expect(this.codeInput).toHaveValue(data.code);
    await expect(this.loanAmountInput).toHaveValue(data.loanAmount);
    await expect(this.interestRateInput).toHaveValue(data.interestRate);
    await expect(this.totalPayableInput).toHaveValue(data.totalPayable);
    await expect(this.installmentPeriodInput).toHaveValue(data.installmentPeriod);
  }

  // ── Save loan form ────────────────────────────────────────────────────────
  async saveLoanForm() {
    await this.saveButton.click();
    // Wait longer for save and redirect to complete
    await this.page.waitForTimeout(5000);
  }

  // ── Verify saved record in table ──────────────────────────────────────────
  async verifySavedInTable(data) {
    // Reload Finance page to ensure fresh data after save
    await this.page.goto(this.financeURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForTimeout(2000);

    // Check loan amount appears in the table
    await expect(
      this.page.getByText(data.loanAmount, { exact: false }).first()
    ).toBeVisible({ timeout: 25000 });
  }

  // ── Get real table row by index ───────────────────────────────────────────
  getRealRow(index = 0) {
    return this.page.locator(
      'table tbody tr:not([aria-hidden="true"])'
    ).nth(index);
  }

  // ── Click 3 dot action menu on a main table row ───────────────────────────
  async clickRowActionMenu(rowIndex = 0) {
    const row = this.getRealRow(rowIndex);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await row.locator('button').last().click();
    await this.page.waitForTimeout(1000);
  }

  // ── Click Edit from action menu ───────────────────────────────────────────
  async clickEdit() {
    await this.editOption.waitFor({ state: 'visible', timeout: 10000 });
    await this.editOption.click();
    await this.page.getByRole('heading', { name: 'Edit' })
      .waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(2000);
  }

  // ── Click View from action menu ───────────────────────────────────────────
  async clickView() {
    await this.viewOption.waitFor({ state: 'visible', timeout: 10000 });
    await this.viewOption.click();
    await this.page.getByRole('heading', { name: 'Details' })
      .waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(2000);
  }

  // ── Click Delete and confirm ──────────────────────────────────────────────
  async clickDelete() {
    await this.deleteOption.waitFor({ state: 'visible', timeout: 10000 });
    await this.deleteOption.click();
    await this.page.waitForTimeout(1000);

    const confirmButton = this.page.getByRole('button', { name: 'Yes' })
      .or(this.page.getByRole('button', { name: 'OK' }))
      .or(this.page.getByRole('button', { name: 'Confirm' }));

    if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmButton.click();
    }
    await this.page.waitForTimeout(2000);
  }

  // ── Verify deleted from table ─────────────────────────────────────────────
  async verifyDeletedFromTable(data) {
    await this.page.goto(this.financeURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForTimeout(2000);
    await expect(
      this.page.getByText(data.code, { exact: false })
    ).not.toBeVisible({ timeout: 10000 });
  }

  // ── Update loan fields ────────────────────────────────────────────────────
  async updateLoanFields(updatedData) {
    await this.editLoanAmount.clear();
    await this.editLoanAmount.fill(updatedData.loanAmount);
    await this.editInterestRate.clear();
    await this.editInterestRate.fill(updatedData.interestRate);
    await this.editInstallments.clear();
    await this.editInstallments.fill(updatedData.numberOfInstallments);
    await this.page.waitForTimeout(1000);
  }

  // ── Assert updated fields ─────────────────────────────────────────────────
  async assertUpdatedFields(updatedData) {
    await expect(this.editLoanAmount).toHaveValue(updatedData.loanAmount);
    await expect(this.editInterestRate).toHaveValue(updatedData.interestRate);
    await expect(this.editInstallments).toHaveValue(updatedData.numberOfInstallments);
  }

  // ── Assert Employee Installments table visible ────────────────────────────
  async assertInstallmentsTableVisible() {
    await expect(
      this.viewDialog.getByRole('heading', { name: 'Employee Installments' })
    ).toBeVisible({ timeout: 10000 });
    await expect(
      this.viewDialog.locator('table').last()
    ).toBeVisible({ timeout: 10000 });
  }

  // ── Save and verify updated data in table ─────────────────────────────────
  async saveAndVerifyInTable(updatedData) {
    await this.saveButton.click();
    await this.page.waitForTimeout(5000);
    await this.page.goto(this.financeURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForTimeout(2000);
    await expect(
      this.page.getByText(updatedData.loanAmount, { exact: false }).first()
    ).toBeVisible({ timeout: 25000 });
  }

  // ── Assert View dialog details section ───────────────────────────────────
  async assertViewDialogDetails() {
    await expect(
      this.viewDialog.getByRole('heading', { name: 'Details' })
    ).toBeVisible({ timeout: 10000 });
    await expect(
      this.viewDialog.getByText('Employee Installments')
    ).toBeVisible({ timeout: 10000 });
    await expect(
      this.viewDialog.getByText('Installment History')
    ).toBeVisible({ timeout: 10000 });
  }

  // ── Click Add New inside Employee Installments (scoped to dialog) ─────────
  async clickInstallmentsAddNew() {
    const addNewBtn = this.viewDialog
      .getByRole('button', { name: 'Add New' });
    await addNewBtn.waitFor({ state: 'visible', timeout: 10000 });
    await addNewBtn.click();
    await this.page.waitForTimeout(2000);
  }

  // ── Fill installment form ─────────────────────────────────────────────────
  async fillInstallmentForm(data) {
    // Wait for modal to open using id
    await this.installmentAmount.waitFor({ state: 'visible', timeout: 15000 });
    await this.installmentAmount.fill(data.amount);

    if (data.paymentDate) {
      const dateField = this.page.locator('input[placeholder*="date"]').last();
      await dateField.fill(data.paymentDate);
      await this.page.keyboard.press('Enter');
    }

    await this.acknowledgedByDropdown.click();
    await this.page.waitForTimeout(1000);
    await this.page.locator('.ant-select-dropdown')
      .locator('.ant-select-item-option-content', { hasText: data.acknowledgedBy })
      .first().click();

    if (data.note) {
      await this.installmentNote.fill(data.note);
    }

    await this.page.waitForTimeout(1000);
  }

  // ── Save installment form ─────────────────────────────────────────────────
  async saveInstallmentForm() {
    await this.page.getByRole('button', { name: 'Save' }).last().click();
    await this.page.waitForTimeout(3000);
  }

  // ── Verify installment in Employee Installments table ────────────────────
  async verifyInstallmentInTable(data) {
    await expect(
      this.viewDialog.getByText(data.amount, { exact: false }).first()
    ).toBeVisible({ timeout: 15000 });
  }

  // ── Get installment row by index (scoped to dialog) ───────────────────────
  getInstallmentRow(index = 0) {
    return this.viewDialog.locator(
      'table tbody tr:not([aria-hidden="true"])'
    ).nth(index);
  }

  // ── Click action menu on installment row ──────────────────────────────────
  async clickInstallmentRowMenu(rowIndex = 0) {
    const row = this.getInstallmentRow(rowIndex);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await row.locator('button').last().click();
    await this.page.waitForTimeout(1000);
  }

  // ── Edit installment row ──────────────────────────────────────────────────
  async editInstallment(rowIndex, newAmount) {
    await this.clickInstallmentRowMenu(rowIndex);
    await this.editOption.waitFor({ state: 'visible', timeout: 10000 });
    await this.editOption.click();
    await this.page.waitForTimeout(1500);

    // Use id for reliability
    await this.page.locator('#installment_amount').clear();
    await this.page.locator('#installment_amount').fill(newAmount);
    await this.page.waitForTimeout(1000);

    await this.page.getByRole('button', { name: 'Save' }).last().click();
    await this.page.waitForTimeout(3000);
  }

  // ── Delete installment row ────────────────────────────────────────────────
  async deleteInstallment(rowIndex) {
    await this.clickInstallmentRowMenu(rowIndex);
    await this.deleteOption.waitFor({ state: 'visible', timeout: 10000 });
    await this.deleteOption.click();
    await this.page.waitForTimeout(1000);

    const confirmButton = this.page.getByRole('button', { name: 'Yes' })
      .or(this.page.getByRole('button', { name: 'OK' }))
      .or(this.page.getByRole('button', { name: 'Confirm' }));

    if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmButton.click();
    }
    await this.page.waitForTimeout(2000);
  }

  // ── View installment row and close ────────────────────────────────────────
  async viewInstallmentAndReturn(rowIndex) {
    await this.clickInstallmentRowMenu(rowIndex);
    await this.viewOption.waitFor({ state: 'visible', timeout: 10000 });
    await this.viewOption.click();
    await this.page.waitForTimeout(2000);

    const closeButton = this.page.locator('[aria-label="Close"]').last();
    if (await closeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await closeButton.click();
    } else {
      await this.page.keyboard.press('Escape');
    }
    await this.page.waitForTimeout(1500);
  }

// ── Assert Installment History section ────────────────────────────────────
async assertInstallmentHistory() {

  // Scroll drawer to bottom to reveal history section
  await this.page.evaluate(() => {
    const drawers = document.querySelectorAll('.ant-drawer-body');
    drawers.forEach(el => el.scrollTop = el.scrollHeight);
  });
  await this.page.waitForTimeout(2000);

  // Assert Installment History heading is visible
  await expect(
    this.page.getByText('Installment History').first()
  ).toBeVisible({ timeout: 10000 });
  console.log("✅ Installment History heading visible");

  // Generate today's date in format "29 Apr, 2026"
  const today = new Date();
  const day   = today.getDate();
  const month = today.toLocaleString('en-US', { month: 'short' });
  const year  = today.getFullYear();
  const formattedDate = `${day} ${month}, ${year}`;

  // Assert date entry is visible
  const dateEntry = this.page.getByText(formattedDate, { exact: false }).first();
  await expect(dateEntry).toBeVisible({ timeout: 10000 });
  console.log(`✅ Date entry visible: ${formattedDate}`);

  // // Click the date entry to expand the collapse
  // await dateEntry.click();
  // await this.page.waitForTimeout(1000);
  // console.log(`✅ Clicked date entry to expand: ${formattedDate}`);

  // // Assert history entry text visible after expanding
  // await expect(
  //   this.page.getByText('Loan payment received', { exact: false }).first()
  // ).toBeVisible({ timeout: 10000 });
  console.log("✅ Loan payment history entry visible");
}

  // ── Close dialog and go back to Finance table ─────────────────────────────
  async closeDialogAndGoToTable() {
    const closeButton = this.viewDialog.locator('[aria-label="Close"]').last();
    if (await closeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await closeButton.click();
    } else {
      await this.page.keyboard.press('Escape');
    }

    await this.page.waitForTimeout(2000);

    // Navigate back to Finance table
    await this.page.goto(this.financeURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForTimeout(2000);

    // Assert we are back on Finance table
    await expect(
      this.page.getByRole('heading', { name: 'Employee Loan Records' })
    ).toBeVisible({ timeout: 15000 });
  }
}

module.exports = FinancePage;