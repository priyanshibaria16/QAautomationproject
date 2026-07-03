const { By } = require('selenium-webdriver');

/**
 * CartPage POM for SauceDemo.
 * Manages checking list of items in the shopping cart, removing items, 
 * continuing shopping, and navigating to checkout.
 */
class CartPage {
  /**
   * @param {WebDriver} driver The Selenium WebDriver instance
   */
  constructor(driver) {
    this.driver = driver;
    
    // Locators
    this.cartItem = By.css('.cart_item');
    this.itemName = By.css('.inventory_item_name');
    this.continueShoppingButton = By.css('[data-test="continue-shopping"]');
    this.checkoutButton = By.css('[data-test="checkout"]');
  }

  /**
   * Retrieves all product names currently displayed inside the cart page.
   * 
   * @returns {Promise<string[]>} Array of product names in the cart
   */
  async getCartItemNames() {
    const elements = await this.driver.findElements(this.itemName);
    const names = [];
    for (const el of elements) {
      names.push(await el.getText());
    }
    return names;
  }

  /**
   * Removes a specific product from the cart by clicking the Remove button in its list entry.
   * 
   * @param {string} productName Name of the product to remove
   */
  async removeItem(productName) {
    const items = await this.driver.findElements(this.cartItem);
    for (const item of items) {
      const nameEl = await item.findElement(this.itemName);
      const name = await nameEl.getText();
      if (name.trim() === productName.trim()) {
        const removeButton = await item.findElement(By.css('.cart_button'));
        await removeButton.click();
        return;
      }
    }
    throw new Error(`Product with name "${productName}" not found in cart.`);
  }

  /**
   * Clicks the "Continue Shopping" button to return to the products page.
   */
  async continueShopping() {
    await this.driver.findElement(this.continueShoppingButton).click();
  }

  /**
   * Clicks the "Checkout" button to transition to the customer details page.
   */
  async clickCheckout() {
    await this.driver.findElement(this.checkoutButton).click();
  }
}

module.exports = CartPage;
