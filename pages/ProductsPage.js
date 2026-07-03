const { By, until } = require('selenium-webdriver');

/**
 * ProductsPage POM for SauceDemo.
 * Manages product lists, sorting, adding/removing items, cart navigation,
 * product details, and the sidebar menu logout.
 */
class ProductsPage {
  /**
   * @param {WebDriver} driver The Selenium WebDriver instance
   */
  constructor(driver) {
    this.driver = driver;
    
    // Locators
    this.inventoryContainer = By.css('.inventory_list');
    this.inventoryItem = By.css('.inventory_item');
    this.itemName = By.css('.inventory_item_name');
    this.itemPrice = By.css('.inventory_item_price');
    this.sortDropdown = By.css('[data-test="product-sort-container"]');
    this.cartBadge = By.css('.shopping_cart_badge');
    this.cartLink = By.css('.shopping_cart_link');
    
    // Burger menu options
    this.burgerMenuButton = By.id('react-burger-menu-btn');
    this.logoutLink = By.id('logout_sidebar_link');
    
    // Product details elements
    this.backToProductsButton = By.css('[data-test="back-to-products"]');
    this.detailItemName = By.css('.inventory_details_name');
    this.detailItemPrice = By.css('.inventory_details_price');
  }

  /**
   * Verifies that the inventory list container is loaded and visible.
   * 
   * @returns {Promise<boolean>} True if visible
   */
  async verifyProductsExist() {
    const list = await this.driver.findElement(this.inventoryContainer);
    return await list.isDisplayed();
  }

  /**
   * Retrieves all product names displayed on the inventory page.
   * 
   * @returns {Promise<string[]>} Array of product names
   */
  async getProductNames() {
    const elements = await this.driver.findElements(this.itemName);
    const names = [];
    for (const el of elements) {
      names.push(await el.getText());
    }
    return names;
  }

  /**
   * Retrieves all product prices displayed on the inventory page.
   * Converts "$29.99" -> 29.99 (float).
   * 
   * @returns {Promise<number[]>} Array of product prices
   */
  async getProductPrices() {
    const elements = await this.driver.findElements(this.itemPrice);
    const prices = [];
    for (const el of elements) {
      const text = await el.getText();
      prices.push(parseFloat(text.replace('$', '')));
    }
    return prices;
  }

  /**
   * Selects a sorting option from the sort dropdown.
   * Options: 'az' (A-Z), 'za' (Z-A), 'lohi' (Low-High), 'hilo' (High-Low)
   * 
   * @param {string} option Sorting value key
   */
  async sortBy(option) {
    const selectEl = await this.driver.findElement(this.sortDropdown);
    await selectEl.click();
    const optionEl = await selectEl.findElement(By.css(`option[value="${option}"]`));
    await optionEl.click();
  }

  /**
   * Finds a product item by its name.
   * 
   * @param {string} productName Name of the product
   * @private
   */
  async _getItemContainerByName(productName) {
    const items = await this.driver.findElements(this.inventoryItem);
    for (const item of items) {
      const nameEl = await item.findElement(this.itemName);
      const name = await nameEl.getText();
      if (name.trim() === productName.trim()) {
        return item;
      }
    }
    throw new Error(`Product with name "${productName}" not found on page.`);
  }

  /**
   * Adds a product to the cart by name.
   * 
   * @param {string} productName Name of the product
   */
  async addToCart(productName) {
    const container = await this._getItemContainerByName(productName);
    const button = await container.findElement(By.css('.btn_inventory'));
    const btnText = await button.getText();
    if (btnText.toUpperCase() === 'ADD TO CART') {
      await button.click();
    }
  }

  /**
   * Removes a product from the cart by name (on products page).
   * 
   * @param {string} productName Name of the product
   */
  async removeFromCart(productName) {
    const container = await this._getItemContainerByName(productName);
    const button = await container.findElement(By.css('.btn_inventory'));
    const btnText = await button.getText();
    if (btnText.toUpperCase() === 'REMOVE') {
      await button.click();
    }
  }

  /**
   * Retrieves the current cart count from the badge element.
   * Returns 0 if badge is not present or visible.
   * 
   * @returns {Promise<number>} Current items count in cart
   */
  async getCartCount() {
    try {
      const elements = await this.driver.findElements(this.cartBadge);
      if (elements.length === 0) {
        return 0;
      }
      const text = await elements[0].getText();
      return parseInt(text.trim()) || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Clicks the shopping cart icon to navigate to the Cart page.
   */
  async clickCart() {
    await this.driver.findElement(this.cartLink).click();
  }

  /**
   * Clicks on the name link of a product to navigate to its details page.
   * 
   * @param {string} productName Name of the product
   */
  async openProductDetails(productName) {
    const container = await this._getItemContainerByName(productName);
    const nameEl = await container.findElement(this.itemName);
    await nameEl.click();
  }

  /**
   * Gets details name on the details page.
   * 
   * @returns {Promise<string>} Product title on details page
   */
  async getDetailsName() {
    return await this.driver.findElement(this.detailItemName).getText();
  }

  /**
   * Gets details price on the details page.
   * 
   * @returns {Promise<number>} Product price on details page
   */
  async getDetailsPrice() {
    const priceText = await this.driver.findElement(this.detailItemPrice).getText();
    return parseFloat(priceText.replace('$', ''));
  }

  /**
   * Clicks "Back to products" button on details page.
   */
  async goBackToProducts() {
    await this.driver.findElement(this.backToProductsButton).click();
  }

  /**
   * Opens the sidebar navigation menu and clicks the Logout link.
   * Uses explicit wait to ensure the menu options have animated in.
   */
  async logout() {
    // Click hamburger button
    await this.driver.findElement(this.burgerMenuButton).click();
    
    // Wait for the logout link to be clickable and visible
    const logoutBtn = await this.driver.findElement(this.logoutLink);
    await this.driver.wait(until.elementIsVisible(logoutBtn), 5000);
    await logoutBtn.click();
  }
}

module.exports = ProductsPage;
