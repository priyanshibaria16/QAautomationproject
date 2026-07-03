const { createDriver } = require('../utils/driver');
const { captureScreenshot } = require('../utils/helper');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const { expect } = require('chai');

describe('Checkout Tests', function () {
  let driver;
  let loginPage;
  let productsPage;
  let cartPage;
  let checkoutPage;

  beforeEach(async function () {
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    productsPage = new ProductsPage(driver);
    cartPage = new CartPage(driver);
    checkoutPage = new CheckoutPage(driver);
    
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.addToCart('Sauce Labs Backpack');
    await productsPage.clickCart();
    await cartPage.clickCheckout();
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      await captureScreenshot(driver, this.currentTest.fullTitle());
    }
    if (driver) {
      await driver.quit();
    }
  });

  it('Successful checkout flow', async function () {
    await checkoutPage.enterCustomerDetails('John', 'Doe', '12345');
    await checkoutPage.clickContinue();
    
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/checkout-step-two.html');
    
    await checkoutPage.clickFinish();
    
    const finishUrl = await driver.getCurrentUrl();
    expect(finishUrl).to.include('/checkout-complete.html');
    
    const completeHeader = await checkoutPage.getCompleteHeaderText();
    expect(completeHeader).to.include('Thank you for your order!');
  });

  it('Checkout validation - missing customer details', async function () {
    // 1. Missing first name
    await checkoutPage.enterCustomerDetails('', 'Doe', '12345');
    await checkoutPage.clickContinue();
    let errMsg = await checkoutPage.getErrorMessage();
    expect(errMsg).to.include('Error: First Name is required');

    // 2. Missing last name
    await checkoutPage.enterCustomerDetails('John', '', '12345');
    await checkoutPage.clickContinue();
    errMsg = await checkoutPage.getErrorMessage();
    expect(errMsg).to.include('Error: Last Name is required');

    // 3. Missing postal code
    await checkoutPage.enterCustomerDetails('John', 'Doe', '');
    await checkoutPage.clickContinue();
    errMsg = await checkoutPage.getErrorMessage();
    expect(errMsg).to.include('Error: Postal Code is required');
  });

  it('Checkout cancellation from step one', async function () {
    await checkoutPage.clickCancel();
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/cart.html');
  });
});
