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
    const errMsg1 = await checkoutPage.getErrorMessage();
    expect(errMsg1).to.include('Error: First Name is required');

    // Navigate back to step one explicitly for the next check
    await driver.navigate().back();
    await driver.navigate().forward();

    // 2. Missing last name
    await checkoutPage.enterCustomerDetails('John', '', '12345');
    await checkoutPage.clickContinue();
    const errMsg2 = await checkoutPage.getErrorMessage();
    expect(errMsg2).to.include('Error: Last Name is required');

    // Navigate back to step one explicitly for the next check
    await driver.navigate().back();
    await driver.navigate().forward();

    // 3. Missing postal code
    await checkoutPage.enterCustomerDetails('John', 'Doe', '');
    await checkoutPage.clickContinue();
    const errMsg3 = await checkoutPage.getErrorMessage();
    expect(errMsg3).to.include('Error: Postal Code is required');
  });

  it('Checkout cancellation from step one', async function () {
    await checkoutPage.clickCancel();
    const currentUrl = await driver.getCurrentUrl();
    // SauceDemo cancel from checkout step-one redirects back to the cart
    expect(currentUrl).to.include('/cart.html');
  });
});
