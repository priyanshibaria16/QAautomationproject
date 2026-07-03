const { createDriver } = require('../utils/driver');
const { captureScreenshot } = require('../utils/helper');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const { expect } = require('chai');

describe('Products Page Tests', function () {
  let driver;
  let loginPage;
  let productsPage;

  beforeEach(async function () {
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    productsPage = new ProductsPage(driver);
    
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    // Ensure we are on inventory page
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.includes('/inventory.html')) {
      throw new Error('Pre-requisite: Failed to log in and reach inventory page.');
    }
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      await captureScreenshot(driver, this.currentTest.fullTitle());
    }
    if (driver) {
      await driver.quit();
    }
  });

  it('Verify Products exist and display correctly', async function () {
    const exists = await productsPage.verifyProductsExist();
    expect(exists).to.be.true;

    const names = await productsPage.getProductNames();
    expect(names.length).to.be.greaterThan(0);
    expect(names).to.include('Sauce Labs Backpack');
  });

  it('Product Details navigation and verification', async function () {
    const productName = 'Sauce Labs Backpack';
    await productsPage.openProductDetails(productName);

    // Verify detail URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/inventory-item.html');

    // Verify detailed name and price
    const detailName = await productsPage.getDetailsName();
    expect(detailName).to.equal(productName);
    
    const detailPrice = await productsPage.getDetailsPrice();
    expect(detailPrice).to.equal(29.99);

    // Navigate back
    await productsPage.goBackToProducts();
    const backUrl = await driver.getCurrentUrl();
    expect(backUrl).to.include('/inventory.html');
  });

  it('Verify Product Sorting by Name and Price', async function () {
    // 1. Sort A-Z
    await productsPage.sortBy('az');
    const namesAZ = await productsPage.getProductNames();
    const sortedNamesAZ = [...namesAZ].sort();
    expect(namesAZ).to.deep.equal(sortedNamesAZ);

    // 2. Sort Z-A
    await productsPage.sortBy('za');
    const namesZA = await productsPage.getProductNames();
    const sortedNamesZA = [...namesAZ].sort().reverse();
    expect(namesZA).to.deep.equal(sortedNamesZA);

    // 3. Sort Price Low to High
    await productsPage.sortBy('lohi');
    const pricesLOHI = await productsPage.getProductPrices();
    const sortedPricesLOHI = [...pricesLOHI].sort((a, b) => a - b);
    expect(pricesLOHI).to.deep.equal(sortedPricesLOHI);

    // 4. Sort Price High to Low
    await productsPage.sortBy('hilo');
    const pricesHILO = await productsPage.getProductPrices();
    const sortedPricesHILO = [...pricesLOHI].sort((a, b) => b - a);
    expect(pricesHILO).to.deep.equal(sortedPricesHILO);
  });
});
