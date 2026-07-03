const fs = require('fs');
const path = require('path');

/**
 * Captures a screenshot of the current browser state and writes it as a PNG file.
 * Automatically creates the output folder if it doesn't exist.
 * 
 * @param {WebDriver} driver The Selenium WebDriver instance
 * @param {string} testName The name of the test to suffix the file name
 * @returns {Promise<string|null>} Absolute path of the captured screenshot, or null on error
 */
async function captureScreenshot(driver, testName) {
  try {
    const screenshot = await driver.takeScreenshot();
    const screenshotsDir = path.join(__dirname, '../reports/screenshots');
    
    // Ensure directory exists
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    // Sanitize test name for filename compatibility
    const sanitizedTitle = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${sanitizedTitle}_failed.png`;
    const filepath = path.join(screenshotsDir, filename);
    
    // Write screenshot buffer to file
    fs.writeFileSync(filepath, screenshot, 'base64');
    console.log(`  [Screenshot Saved] Failure screenshot captured for: "${testName}" -> ${filepath}`);
    return filepath;
  } catch (error) {
    console.error('  [Screenshot Error] Failed to capture failure screenshot:', error.message);
    return null;
  }
}

module.exports = { captureScreenshot };
