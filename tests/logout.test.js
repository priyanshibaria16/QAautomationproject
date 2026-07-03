const { createDriver } = require('../utils/driver');
const { captureScreenshot } = require('../utils/helper');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const { expect } = require('chai');

describe('Logout Tests', function () {
  let driver;
  let loginPage;
  let productsPage;

  beforeEach(async function () {
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    productsPage = new ProductsPage(driver);
    
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      await captureScreenshot(driver, this.currentTest.fullTitle());
    }
    if (driver) {
      await driver.quit();
    }
  });

  it('Successful logout and redirection', async function () {
    // Perform logout using the hamburger menu
    await productsPage.logout();
    
    // Verify redirect URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal('https://www.saucedemo.com/');
    
    // Verify login form elements are back and visible
    const isLoginButtonVisible = await driver.findElement(loginPage.loginButton).isDisplayed();
    expect(isLoginButtonVisible).to.be.true;
  });
});
