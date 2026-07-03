const { By } = require('selenium-webdriver');

/**
 * LoginPage POM for SauceDemo.
 * Encapsulates login input actions, error container inspection, and navigation.
 */
class LoginPage {
  /**
   * @param {WebDriver} driver The Selenium WebDriver instance
   */
  constructor(driver) {
    this.driver = driver;
    this.url = 'https://www.saucedemo.com';
    
    // Locators
    this.usernameInput = By.css('[data-test="username"]');
    this.passwordInput = By.css('[data-test="password"]');
    this.loginButton = By.css('[data-test="login-button"]');
    this.errorContainer = By.css('[data-test="error"]');
  }

  /**
   * Navigates to the SauceDemo home/login page.
   */
  async navigate() {
    await this.driver.get(this.url);
  }

  /**
   * Enters username and password, then clicks the login button.
   * Clears fields before typing. Handles empty string values gracefully.
   * 
   * @param {string} username Username value to type
   * @param {string} password Password value to type
   */
  async login(username, password) {
    const { clearAndType } = require('../utils/helper');
    const userField = await this.driver.findElement(this.usernameInput);
    await clearAndType(userField, username);

    const passField = await this.driver.findElement(this.passwordInput);
    await clearAndType(passField, password);

    await this.driver.findElement(this.loginButton).click();
  }

  /**
   * Retrieves the text displayed in the validation error banner if login fails.
   * 
   * @returns {Promise<string>} The error message text
   */
  async getErrorMessage() {
    const errorElement = await this.driver.findElement(this.errorContainer);
    return await errorElement.getText();
  }
}

module.exports = LoginPage;
