const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function main() {
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  try {
    console.log('Navigating to SauceDemo...');
    await driver.get('https://www.saucedemo.com');
    
    // Login with empty username
    console.log('Attempting empty username login...');
    await driver.findElement(By.css('[data-test="username"]')).clear();
    const passwordField = await driver.findElement(By.css('[data-test="password"]'));
    await passwordField.clear();
    await passwordField.sendKeys('secret_sauce');
    
    await driver.findElement(By.css('[data-test="login-button"]')).click();
    
    console.log('Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Current URL:', await driver.getCurrentUrl());
    
    const html = await driver.getPageSource();
    const errorMatch = html.match(/<[^>]*class="[^"]*error[^"]*"[^>]*>/g);
    console.log('Error tags match:', errorMatch);
    
    try {
      const errorEl = await driver.findElement(By.css('[data-test="error"]'));
      console.log('Found error element text:', await errorEl.getText());
    } catch (e) {
      console.log('Could not find [data-test="error"]:', e.message);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await driver.quit();
  }
}

main();
