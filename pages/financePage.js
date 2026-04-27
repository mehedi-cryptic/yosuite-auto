const { expect } = require('@playwright/test');

class FinancePage {

  constructor(page) {
    this.page = page;
    this.financeURL = "https://roxsxsnor.yosuite.net/page/modules/loans/loan/list";

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
    this.deleteOption = page.getByRole('menuitem', { name: 'Delete' });

    // Edit form fields
    this.editLoanAmount   = page.getByRole('spinbutton', { name: 'Loan Amount *' });
    this.editInterestRate = page.getByRole('spinbutton', { name: 'Interest Rate *' });
    this.editInstallments = page.getByRole('spinbutton', { name: 'Number of Installments *' });

    // Employee Installments table heading
    this.installmentsTable = page.getByRole('heading', { name: 'Employee Installments' });
  }

  // Navigate to Finance page
  async goToFinance() {
    await this.page.goto(this.financeURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForSelector('text=Add New', { timeout: 30000 });
    await this.page.waitForTimeout(2000);
  }

  async navigateToFinance() {
    await this.goToFinance();
  }

  // Click Add New button
  async clickAddNew() {
    await this.page.getByRole('link', { name: 'Add New' }).click();
    await this.page.getByRole('heading', { name: 'Add' })
      .waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(2000);
  }

  // Fill Add New form
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

  // Assert Add New form fields
  async assertFormFields(data) {
    await expect(this.codeInput).toHaveValue(data.code);
    await expect(this.loanAmountInput).toHaveValue(data.loanAmount);
    await expect(this.interestRateInput).toHaveValue(data.interestRate);
    await expect(this.totalPayableInput).toHaveValue(data.totalPayable);
    await expect(this.installmentPeriodInput).toHaveValue(data.installmentPeriod);
  }

  // Save form
  async saveLoanForm() {
    await this.saveButton.click();
    await this.page.waitForTimeout(3000);
  }

  // Verify saved record appears in table
  async verifySavedInTable(data) {
    await expect(
      this.page.getByText(data.loanAmount, { exact: false }).first()
    ).toBeVisible({ timeout: 15000 });
  }

  // Get first real row — skips hidden ant-table-measure-row
  getFirstRealRow() {
    return this.page.locator(
      'table tbody tr:not([aria-hidden="true"])'
    ).first();
  }

  // Click 3 dot action menu on a specific row number (0 = first)
  async clickRowActionMenu(rowIndex = 0) {
    const row = this.page.locator(
      'table tbody tr:not([aria-hidden="true"])'
    ).nth(rowIndex);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await row.locator('button').last().click();
    await this.page.waitForTimeout(1000);
  }

  // Click Edit from action menu
  async clickEdit() {
    await this.editOption.waitFor({ state: 'visible', timeout: 10000 });
    await this.editOption.click();
    await this.page.getByRole('heading', { name: 'Edit' })
      .waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(2000);
  }

  // Click Delete from action menu and confirm
  async clickDelete() {
    await this.deleteOption.waitFor({ state: 'visible', timeout: 10000 });
    await this.deleteOption.click();
    await this.page.waitForTimeout(1000);

    // Confirm delete if a confirmation dialog appears
    const confirmButton = this.page.getByRole('button', { name: 'Yes' })
      .or(this.page.getByRole('button', { name: 'OK' }))
      .or(this.page.getByRole('button', { name: 'Confirm' }));

    // Click confirm only if it appears
    if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmButton.click();
    }

    await this.page.waitForTimeout(2000);
  }

  // Verify a record is NOT in the table (after delete)
  async verifyDeletedFromTable(data) {
    await this.page.goto(this.financeURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForTimeout(2000);
    await expect(
      this.page.getByText(data.code, { exact: false })
    ).not.toBeVisible({ timeout: 10000 });
  }

  // Update fields in Edit form
  async updateLoanFields(updatedData) {
    await this.editLoanAmount.clear();
    await this.editLoanAmount.fill(updatedData.loanAmount);

    await this.editInterestRate.clear();
    await this.editInterestRate.fill(updatedData.interestRate);

    await this.editInstallments.clear();
    await this.editInstallments.fill(updatedData.numberOfInstallments);

    await this.page.waitForTimeout(1000);
  }

  // Assert updated fields have correct values
  async assertUpdatedFields(updatedData) {
    await expect(this.editLoanAmount).toHaveValue(updatedData.loanAmount);
    await expect(this.editInterestRate).toHaveValue(updatedData.interestRate);
    await expect(this.editInstallments).toHaveValue(updatedData.numberOfInstallments);
  }

  // Assert Employee Installments table is visible
  async assertInstallmentsTableVisible() {
    await expect(this.installmentsTable).toBeVisible({ timeout: 10000 });
    await expect(this.page.locator('table').last()).toBeVisible({ timeout: 10000 });
  }

  // Save and verify updated data back in table
  async saveAndVerifyInTable(updatedData) {
    await this.saveButton.click();
    await this.page.waitForTimeout(3000);

    await this.page.goto(this.financeURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForTimeout(2000);

    await expect(
      this.page.getByText(updatedData.loanAmount, { exact: false }).first()
    ).toBeVisible({ timeout: 15000 });
  }
}

module.exports = FinancePage;