const { createDriver } = require('../utils/driver');
const { captureScreenshot } = require('../utils/helper');
const LoginPage = require('../pages/LoginPage');
const { expect } = require('chai');

describe('Login Tests', function () {
  let driver;
  let loginPage;

  before(async function () {
    driver = await createDriver();
    loginPage = new LoginPage(driver);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async function () {
    await loginPage.navigate();
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      await captureScreenshot(driver, this.currentTest.fullTitle());
    }
  });

  it('Should log in successfully with valid credentials', async function () {
    await loginPage.login('standard_user', 'secret_sauce');
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/inventory.html');
  });

  it('Should display an error with invalid credentials', async function () {
    await loginPage.login('invalid_user', 'secret_sauce');
    const errMsg = await loginPage.getErrorMessage();
    expect(errMsg).to.include('Epic sadface: Username and password do not match any user in this service');
  });

  it('Should display an error with empty username', async function () {
    await loginPage.login('', 'secret_sauce');
    const errMsg = await loginPage.getErrorMessage();
    expect(errMsg).to.include('Epic sadface: Username is required');
  });

  it('Should display an error with empty password', async function () {
    await loginPage.login('standard_user', '');
    const errMsg = await loginPage.getErrorMessage();
    expect(errMsg).to.include('Epic sadface: Password is required');
  });

  it('Should display an error for locked out user', async function () {
    await loginPage.login('locked_out_user', 'secret_sauce');
    const errMsg = await loginPage.getErrorMessage();
    expect(errMsg).to.include('Epic sadface: Sorry, this user has been locked out.');
  });
});
