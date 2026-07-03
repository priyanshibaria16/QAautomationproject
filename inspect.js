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
    
    // Print page title
    console.log('Title:', await driver.getTitle());
    
    // Find inputs
    const html = await driver.getPageSource();
    console.log('Page source snippet containing user-name:');
    const match = html.match(/<input[^>]*>/g);
    if (match) {
      console.log(match.filter(tag => tag.includes('user-name') || tag.includes('password') || tag.includes('login-button')));
    } else {
      console.log('No input tags found.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await driver.quit();
  }
}

main();
