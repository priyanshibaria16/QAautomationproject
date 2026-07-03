const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Selenium-webdriver 4+ has built-in Selenium Manager to resolve drivers automatically.

/**
 * Creates and configures a new Selenium WebDriver instance for Chrome.
 * Supports configurable headless execution via HEADLESS env variable.
 * 
 * @returns {Promise<ThenableWebDriver>} Selenium WebDriver instance
 */
async function createDriver() {
  const options = new chrome.Options();
  
  // Add recommended arguments for stable browser automation runs
  options.addArguments('--start-maximized');
  options.addArguments('--disable-extensions');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  
  // Run headless if requested in environment (great for CI/CD)
  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless=new');
  }

  // Exclude logging options to avoid terminal pollution
  options.excludeSwitches('enable-logging');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  // Set an implicit wait timeout of 10 seconds for general element resolution
  await driver.manage().setTimeouts({ implicit: 10000 });

  return driver;
}

module.exports = { createDriver };
