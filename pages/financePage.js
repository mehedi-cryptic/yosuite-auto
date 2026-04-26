const { expect } = require('@playwright/test');

class FinancePage {

  constructor(page) {
    this.page = page;
    this.financeURL = "https://roxsxsnor.yosuite.net/page/modules/loans/loan/list";

    // Dropdowns by aria-label
    this.employeeDropdown = page.getByRole('combobox', { name: 'Employee *' });
    this.currencyDropdown = page.getByRole('combobox', { name: 'Currency *' });
    this.statusDropdown   = page.getByRole('combobox', { name: 'Status *' });

    // Spinbuttons by aria-label
    this.loanAmountInput        = page.getByRole('spinbutton', { name: 'Loan Amount *' });
    this.interestRateInput      = page.getByRole('spinbutton', { name: 'Interest Rate *' });
    this.totalPayableInput      = page.getByRole('spinbutton', { name: 'Total Payable Amount *' });
    this.numberOfInstallments   = page.getByRole('spinbutton', { name: 'Number of Installments *' });
    this.installmentPeriodInput = page.getByRole('spinbutton', { name: 'Installment Period *' });

    // Text inputs
    this.codeInput               = page.locator('[placeholder="e.g., LOAN-123"]');
    this.dateOfApprovalInput     = page.locator('[placeholder="Select approval date"]');
    this.dateOfDisbursementInput = page.locator('[placeholder="Select disbursement date"]');
    this.repaymentStartsInput    = page.locator('[placeholder="Select repayment date"]');

    // Save button
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async goToFinance() {
    await this.page.goto(this.financeURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForSelector('text=Add New', { timeout: 30000 });
    await this.page.waitForTimeout(2000);
  }

  async clickAddNew() {
    await this.page.getByRole('link', { name: 'Add New' }).click();
    await this.page.getByRole('heading', { name: 'Add' }).waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(2000);
  }

  async fillLoanForm(data) {

    // Employee
    await this.employeeDropdown.click();
    await this.employeeDropdown.fill(data.employee);
    await this.page.waitForTimeout(1000);
    await this.page.locator('.ant-select-dropdown')
      .locator('.ant-select-item-option-content', { hasText: data.employee })
      .first().click();

    // Code — max 8 characters
    await this.codeInput.fill(data.code);

    // Date of Approval
    await this.dateOfApprovalInput.fill(data.dateOfApproval);
    await this.page.keyboard.press('Enter');

    // Date of Disbursement
    await this.dateOfDisbursementInput.fill(data.dateOfDisbursement);
    await this.page.keyboard.press('Enter');

    // Repayment Starts
    await this.repaymentStartsInput.fill(data.repaymentStarts);
    await this.page.keyboard.press('Enter');

    // Currency — only change if not already USD
    const currencyValue = await this.currencyDropdown.inputValue();
    if (!currencyValue.includes(data.currency)) {
      await this.currencyDropdown.click();
      await this.currencyDropdown.fill(data.currency);
      await this.page.waitForTimeout(1000);
      await this.page.locator('.ant-select-dropdown')
        .locator('.ant-select-item-option-content', { hasText: data.currency })
        .first().click();
    }

    // Numeric fields
    await this.loanAmountInput.fill(data.loanAmount);
    await this.interestRateInput.fill(data.interestRate);
    await this.totalPayableInput.fill(data.totalPayable);
    await this.numberOfInstallments.fill(data.numberOfInstallments);
    await this.installmentPeriodInput.fill(data.installmentPeriod);

    // Status
    await this.statusDropdown.click();
    await this.page.waitForTimeout(1000);
    await this.page.locator('.ant-select-dropdown')
      .locator('.ant-select-item-option-content', { hasText: data.status })
      .first().click();
  }

  async assertFormFields(data) {
    await expect(this.codeInput).toHaveValue(data.code);
    await expect(this.loanAmountInput).toHaveValue(data.loanAmount);
    await expect(this.interestRateInput).toHaveValue(data.interestRate);
    await expect(this.totalPayableInput).toHaveValue(data.totalPayable);
    await expect(this.installmentPeriodInput).toHaveValue(data.installmentPeriod);
  }

  async saveLoanForm() {
    await this.saveButton.click();
    await this.page.waitForTimeout(3000);
  }

  async verifySavedInTable(data) {
    await expect(
      this.page.getByText(data.loanAmount, { exact: false }).first()
    ).toBeVisible({ timeout: 15000 });
  }

  async navigateToFinance() {
    await this.goToFinance();
  }
}

module.exports = FinancePage;