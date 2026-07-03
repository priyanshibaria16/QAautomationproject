const { createDriver } = require('../utils/driver');
const { captureScreenshot } = require('../utils/helper');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');
const { expect } = require('chai');

describe('Cart Tests', function () {
  let driver;
  let loginPage;
  let productsPage;
  let cartPage;

  beforeEach(async function () {
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    productsPage = new ProductsPage(driver);
    cartPage = new CartPage(driver);
    
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

  it('Add a single product to cart', async function () {
    const product = 'Sauce Labs Backpack';
    await productsPage.addToCart(product);
    
    const count = await productsPage.getCartCount();
    expect(count).to.equal(1);
    
    await productsPage.clickCart();
    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems).to.include(product);
    expect(cartItems.length).to.equal(1);
  });

  it('Add multiple products to cart', async function () {
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt', 'Sauce Labs Onesie'];
    for (const p of products) {
      await productsPage.addToCart(p);
    }
    
    const count = await productsPage.getCartCount();
    expect(count).to.equal(3);
    
    await productsPage.clickCart();
    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems.length).to.equal(3);
    for (const p of products) {
      expect(cartItems).to.include(p);
    }
  });

  it('Remove a product from the cart page', async function () {
    const product = 'Sauce Labs Backpack';
    await productsPage.addToCart(product);
    await productsPage.clickCart();
    
    // Remove from cart page
    await cartPage.removeItem(product);
    
    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems).to.not.include(product);
    expect(cartItems.length).to.equal(0);
  });

  it('Verify Continue Shopping redirects to products page', async function () {
    await productsPage.clickCart();
    await cartPage.continueShopping();
    
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/inventory.html');
  });
});
