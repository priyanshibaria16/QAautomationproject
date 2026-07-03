const { By } = require('selenium-webdriver');

/**
 * CheckoutPage POM for SauceDemo.
 * Manages entering client delivery details, proceeding or cancelling orders,
 * finishing transactions, and reading final confirmation text.
 */
class CheckoutPage {
  /**
   * @param {WebDriver} driver The Selenium WebDriver instance
   */
  constructor(driver) {
    this.driver = driver;
    
    // Locators
    this.firstNameInput = By.css('[data-test="firstName"]');
    this.lastNameInput = By.css('[data-test="lastName"]');
    this.postalCodeInput = By.css('[data-test="postalCode"]');
    this.continueButton = By.css('[data-test="continue"]');
    this.cancelButton = By.css('[data-test="cancel"]');
    this.finishButton = By.css('[data-test="finish"]');
    this.errorContainer = By.css('[data-test="error"]');
    this.completeHeader = By.css('[data-test="complete-header"]');
  }

  /**
   * Enters customer delivery particulars in checkout step one.
   * Clears fields before writing. Handles empty strings gracefully.
   * 
   * @param {string} firstName Client first name
   * @param {string} lastName Client last name
   * @param {string} postalCode Client zip code
   */
  async enterCustomerDetails(firstName, lastName, postalCode) {
    const { clearAndType } = require('../utils/helper');
    const fnField = await this.driver.findElement(this.firstNameInput);
    await clearAndType(fnField, firstName);

    const lnField = await this.driver.findElement(this.lastNameInput);
    await clearAndType(lnField, lastName);

    const pcField = await this.driver.findElement(this.postalCodeInput);
    await clearAndType(pcField, postalCode);
  }

  /**
   * Clicks the continue button to submit customer details and proceed to review.
   */
  async clickContinue() {
    await this.driver.findElement(this.continueButton).click();
  }

  /**
   * Clicks the cancel button to abandon checkout.
   */
  async clickCancel() {
    await this.driver.findElement(this.cancelButton).click();
  }

  /**
   * Clicks the finish button on checkout step two (review page) to complete order.
   */
  async clickFinish() {
    await this.driver.findElement(this.finishButton).click();
  }

  /**
   * Retrieves the text displayed in the validation error banner if info is missing.
   * 
   * @returns {Promise<string>} The validation error text
   */
  async getErrorMessage() {
    const errorEl = await this.driver.findElement(this.errorContainer);
    return await errorEl.getText();
  }

  /**
   * Gets the confirmation header text on checkout complete page.
   * 
   * @returns {Promise<string>} The confirmation text
   */
  async getCompleteHeaderText() {
    const headerEl = await this.driver.findElement(this.completeHeader);
    return await headerEl.getText();
  }
}

module.exports = CheckoutPage;
