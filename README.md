# QA Automation Framework

> **Professional Selenium WebDriver Automation Framework** for [SauceDemo](https://www.saucedemo.com) — a feature-complete e-commerce test lab. Built with the **Page Object Model (POM)** design pattern and fully automated API testing using **Postman + ReqRes**.

---

## 🎯 Project Overview

This framework automates real-world QA scenarios across five modules — Login, Products, Cart, Checkout, and Logout — using industry-standard tools. It generates rich HTML test reports and automatically captures screenshots for any failing test, making debugging effortless.

### What Gets Tested?

| Module | Test Scenarios |
|--------|---------------|
| 🔐 **Login** | Valid login, invalid credentials, empty username, empty password, locked-out user |
| 🛍️ **Products** | Product list visibility, product details, sorting (A-Z, Z-A, Price Low-High, Price High-Low) |
| 🛒 **Cart** | Add single/multiple products, remove product, cart count verification, continue shopping |
| 💳 **Checkout** | Full purchase flow, missing field validation, order cancellation |
| 🚪 **Logout** | Secure session termination and redirect to login page |
| 📡 **API (Postman)** | Login, Get Users, Create User, Update User, Delete User via ReqRes |

---

## 🚀 Technology Stack

### Why Each Tool Was Chosen

| Tool | Role | Why It's Used |
|------|------|---------------|
| **Node.js v18+** | Runtime Environment | Runs JavaScript outside the browser; required for Selenium and Mocha to execute |
| **Selenium WebDriver** | UI Automation Engine | Industry-standard library that controls real Chrome browser sessions via the WebDriver protocol |
| **ChromeDriver** | Browser Bridge | Acts as a bridge between Selenium commands and the Chrome browser; version must match Chrome |
| **Mocha** | Test Runner | Organizes tests into `describe`/`it` blocks, provides hooks (`before`, `after`, `beforeEach`, `afterEach`), and controls test execution flow |
| **Chai** | Assertion Library | Provides human-readable assertion syntax like `expect(value).to.equal(3)` — far more readable than Node's built-in `assert` |
| **Mochawesome** | HTML Reporter | Generates a beautiful, interactive HTML report summarizing all test results, durations, and errors |
| **Postman** | API Testing | Industry-standard tool for building, testing, and documenting REST API collections with built-in JavaScript test scripts |

---

## 📁 Folder Structure Explained

```
QA-Automation-Framework/
│
├── 📂 pages/                        ← Page Object Model classes
│   ├── LoginPage.js                 ← Wraps the login form: username, password, error banner
│   ├── ProductsPage.js              ← Wraps inventory, sorting, cart badge, burger menu
│   ├── CartPage.js                  ← Wraps cart item list, remove buttons, checkout button
│   └── CheckoutPage.js             ← Wraps info form, continue/cancel/finish buttons, confirmation
│
├── 📂 tests/                        ← Mocha test suites (one file per module)
│   ├── login.test.js                ← 5 tests: valid login, invalid, empty fields, locked user
│   ├── products.test.js             ← 3 tests: product list, details navigation, sorting
│   ├── cart.test.js                 ← 4 tests: add/remove products, count verification
│   ├── checkout.test.js             ← 3 tests: full flow, field validation, cancellation
│   └── logout.test.js               ← 1 test: logout and redirect verification
│
├── 📂 utils/                        ← Shared utilities
│   ├── driver.js                    ← WebDriver factory (creates Chrome instance, supports HEADLESS mode)
│   └── helper.js                    ← Screenshot capture and input clearing utilities
│
├── 📂 reports/                      ← Auto-generated after running tests (git-ignored)
│   ├── report.html                  ← Interactive HTML test report (open in any browser)
│   ├── report.json                  ← Raw JSON report data
│   └── screenshots/                 ← Auto-captured PNG screenshots of failed tests
│
├── ReqRes_API_Collection.json       ← Postman Collection: 5 API tests with JS assertions
├── package.json                     ← NPM dependencies and test script configuration
├── .gitignore                       ← Excludes node_modules, reports, screenshots from Git
└── README.md                        ← This file
```

### Why Page Object Model (POM)?

Without POM, if a web element's selector changes (e.g., the login button ID changes), you'd have to update every test file. With POM:

- Each page has **one class** that owns all locators and actions for that page
- Tests only call **methods** — not raw Selenium commands
- When the UI changes, you fix it in **one place only**

```
Without POM:              With POM:
──────────────            ──────────────
login.test.js  ──┐        login.test.js ── LoginPage.login()
products.test  ──┤ driver  products.test ── ProductsPage.addToCart()
cart.test.js   ──┤ calls   
checkout.test  ──┘        All driver calls centralized in /pages/
```

---

## ⚙️ Installation Guide

### Prerequisites

Before installing, ensure you have the following on your machine:

1. **Node.js v18 or above** — Download from [nodejs.org](https://nodejs.org)
   ```bash
   node -v   # Should print v18.x or above
   npm -v    # Should print 8.x or above
   ```

2. **Google Chrome** — Download from [google.com/chrome](https://google.com/chrome)
   > ⚠️ ChromeDriver version in `package.json` must match your Chrome browser version.

3. **Git** — Download from [git-scm.com](https://git-scm.com)

4. **Postman Desktop** — Download from [postman.com](https://www.postman.com/downloads/) for API testing

### Step-by-Step Setup

**Step 1 — Clone the repository:**
```bash
git clone <your-repo-url>
cd QA-Automation-Framework
```

**Step 2 — Install all dependencies:**
```bash
npm install
```

This single command installs:
- `selenium-webdriver` — Core automation engine
- `chromedriver` — Chrome browser driver binary
- `mocha` — Test runner
- `chai` — Assertion library
- `mochawesome` — HTML report generator

**Step 3 — Verify installation:**
```bash
node -e "require('selenium-webdriver'); console.log('Selenium OK');"
npx mocha --version
```

---

## 💻 Running the Test Suite

### Option 1 — Headless Mode (Recommended)

Headless mode runs Chrome invisibly without opening a browser window. Ideal for CI/CD servers, containers, and faster local runs.

**Windows (PowerShell):**
```powershell
$env:HEADLESS="true"; npm test
```

**macOS / Linux (Bash):**
```bash
HEADLESS=true npm test
```

### Option 2 — Headful Mode (See the Browser)

Opens a real Chrome window so you can watch the automation in action:
```bash
npm test
```

### Running Individual Test Files

You can run a single module's tests using `mocha` directly:
```bash
# Run only Login tests
npx mocha tests/login.test.js --timeout 20000

# Run only Cart tests
npx mocha tests/cart.test.js --timeout 20000

# Run only Checkout tests
npx mocha tests/checkout.test.js --timeout 20000
```

### How the Test Script Works

In `package.json`, the test script is:
```json
"test": "mocha tests/**/*.test.js --reporter mochawesome --reporter-options reportDir=reports,reportFilename=report,overwrite=true,html=true,json=true --timeout 20000"
```

| Part | What it Does |
|------|-------------|
| `tests/**/*.test.js` | Runs every file ending in `.test.js` inside the `tests/` folder |
| `--reporter mochawesome` | Uses the Mochawesome reporter instead of default console output |
| `reportDir=reports` | Saves the HTML/JSON report into the `reports/` folder |
| `--timeout 20000` | Gives each test 20 seconds before marking it as failed |

---

## 📊 Test Reports & Screenshots

### HTML Report

After every test run, Mochawesome generates an interactive HTML report at **`reports/report.html`**.

Open it directly in Chrome:
```bash
start reports/report.html      # Windows
open reports/report.html       # macOS
xdg-open reports/report.html   # Linux
```

The report shows:
- ✅ All passing tests with duration
- ❌ All failing tests with stack traces
- 📈 Summary statistics (pass rate, total duration)

### Automatic Failure Screenshots

The `utils/helper.js` `captureScreenshot()` function is called automatically inside `afterEach` whenever a test fails:

```js
afterEach(async function () {
  if (this.currentTest.state === 'failed') {
    await captureScreenshot(driver, this.currentTest.fullTitle());
  }
});
```

**Screenshot naming convention:**
```
reports/screenshots/<test_description>_failed.png
```

**Example — Login Page (SauceDemo):**

![SauceDemo Login Page](reports/screenshots/login_tests_should_display_an_error_with_empty_username_failed.png)

> *Screenshot auto-captured when the empty username test detected a missing error banner. The Login page is shown with empty Username and Password fields, demonstrating the state the browser was in at the time of failure.*

**Example — Checkout Step 1 (Customer Info):**

![Checkout Information Page](reports/screenshots/checkout_tests_checkout_validation___missing_customer_details_failed.png)

> *Screenshot captured during the checkout validation test failure. Shows the "Checkout: Your Information" step with all fields empty — the exact state when the framework couldn't locate the validation error message.*

**Example — Products Page (Scrolled to Onesie):**

![Products Inventory Page](reports/screenshots/cart_tests_add_multiple_products_to_cart_failed.png)

> *Screenshot from the multiple-products cart test. Shows the inventory page scrolled down to the "Sauce Labs Onesie" product — the item that was below the viewport in headless mode, causing the scroll-into-view fix to be applied.*

---

## 🏗️ Framework Architecture

### How a Test Works End-to-End

```
Test File (login.test.js)
        │
        ▼
 beforeEach Hook
  └─ createDriver()          ← utils/driver.js creates a fresh Chrome session
  └─ new LoginPage(driver)   ← POM class initialized with driver
  └─ loginPage.navigate()    ← Opens https://www.saucedemo.com
        │
        ▼
 it('Should log in...') {
  └─ loginPage.login(user, pass)     ← POM method fills form & clicks Login
  └─ expect(url).to.include(...)     ← Chai assertion validates result
  }
        │
        ▼
 afterEach Hook
  └─ captureScreenshot() if FAILED   ← helper.js saves PNG to reports/screenshots/
  └─ driver.quit()                   ← Chrome session closed
```

### How the POM Pattern Works in This Project

**LoginPage.js encapsulates selectors and actions:**
```js
class LoginPage {
  constructor(driver) {
    this.usernameInput = By.css('[data-test="username"]');
    this.passwordInput = By.css('[data-test="password"]');
    this.loginButton   = By.css('[data-test="login-button"]');
    this.errorContainer = By.css('[data-test="error"]');
  }

  async login(username, password) {
    // Fills in form and clicks login — test never touches raw Selenium
  }

  async getErrorMessage() {
    return await this.driver.findElement(this.errorContainer).getText();
  }
}
```

**login.test.js just calls methods:**
```js
it('Should display an error with empty username', async function () {
  await loginPage.login('', 'secret_sauce');          // POM call
  const errMsg = await loginPage.getErrorMessage();   // POM call
  expect(errMsg).to.include('Username is required'); // Chai assertion
});
```

### Screenshot Capture Flow

```
Test FAILS
    │
    ▼
afterEach detects state === 'failed'
    │
    ▼
captureScreenshot(driver, testTitle)
    │
    ├─ driver.takeScreenshot() → base64 PNG
    ├─ mkdir reports/screenshots (if missing)
    ├─ Sanitize test title → safe filename
    └─ fs.writeFileSync(filepath, screenshot, 'base64')
    │
    ▼
reports/screenshots/<test_name>_failed.png  ✅ Saved
```

---

## 📡 API Testing with Postman

The `ReqRes_API_Collection.json` file contains 5 ready-to-run API requests targeting [reqres.in](https://reqres.in) — a hosted REST API for testing and prototyping.

### Collection Summary

| # | Request | Method | Endpoint | Validates |
|---|---------|--------|----------|-----------|
| 1 | **Login** | `POST` | `/api/login` | Status 200, token string returned |
| 2 | **Get Users** | `GET` | `/api/users?page=2` | Status 200, page=2, data array |
| 3 | **Create User** | `POST` | `/api/users` | Status 201, id + createdAt assigned |
| 4 | **Update User** | `PUT` | `/api/users/2` | Status 200, updatedAt timestamp |
| 5 | **Delete User** | `DELETE` | `/api/users/2` | Status 204, empty body |

### Embedded Test Script Example

Every request in the collection contains JavaScript test scripts like this:

```js
// Example: Login API test scripts
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Response contains token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.be.a("string");
    pm.expect(jsonData.token.length).to.be.above(0);
});
```

### How to Import and Run in Postman

1. Open **Postman Desktop**
2. Click **Import** (top left)
3. Drag and drop `ReqRes_API_Collection.json` into the dialog
4. Click the **"ReqRes API Collection"** in the left sidebar
5. Click **"Run collection"** → Select all 5 requests → Click **"Run ReqRes API Collection"**
6. All requests execute sequentially and each test script assertion is validated

---

## 🧪 Test Module Deep Dive

### Module 1 — Login Tests (`tests/login.test.js`)

The login tests validate all entry point scenarios for SauceDemo:

```
┌──────────────────────────────────────────────────┐
│              Login Test Cases                     │
├────────────────────────┬─────────────────────────┤
│ Test                   │ Expected Result          │
├────────────────────────┼─────────────────────────┤
│ Valid Credentials      │ Redirects to /inventory  │
│ Invalid Password       │ Error: credentials mismatch│
│ Empty Username         │ Error: Username required │
│ Empty Password         │ Error: Password required │
│ Locked Out User        │ Error: User locked out   │
└────────────────────────┴─────────────────────────┘
```

**SauceDemo test credentials:**
- `standard_user` / `secret_sauce` → Valid login ✅
- `locked_out_user` / `secret_sauce` → Locked user ❌
- `problem_user` / `secret_sauce` → Broken images 🐛

### Module 2 — Products Tests (`tests/products.test.js`)

Validates the inventory page functionality:
- Product names, descriptions, and prices are visible
- Clicking a product name navigates to its detail page with correct info
- The sort dropdown correctly reorders items in all 4 directions (A-Z, Z-A, Price ↑, Price ↓)

### Module 3 — Cart Tests (`tests/cart.test.js`)

Full cart lifecycle testing:
- Adding items scrolls them into view first (important for headless mode)
- Cart badge count is verified after each addition
- Remove button on the cart page removes the correct item
- "Continue Shopping" navigates back to the inventory

### Module 4 — Checkout Tests (`tests/checkout.test.js`)

Tests the entire checkout funnel:
- Customer info form fills correctly and continues to the order overview
- Missing fields each display their specific validation error
- Cancel button redirects away from the checkout flow

### Module 5 — Logout Tests (`tests/logout.test.js`)

- Opens the hamburger (☰) sidebar menu
- Waits for the menu to animate open with an explicit wait
- Clicks Logout and verifies the URL returns to the login page
- Verifies the Login button is visible again

---

## 🔧 Configuration Reference

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HEADLESS` | `false` (not set) | Set to `"true"` to run Chrome invisibly |

### Mocha Timeout

The default test timeout is `20000ms` (20 seconds). You can change this in `package.json`:
```json
"test": "mocha tests/**/*.test.js --timeout 30000"
```
Or per-test:
```js
it('My slow test', async function () {
  this.timeout(30000); // Override for this specific test
  // ...
});
```

### Driver Configuration (`utils/driver.js`)

```js
const options = new chrome.Options();
options.addArguments('--start-maximized');      // Full window
options.addArguments('--disable-extensions');   // No extensions
options.addArguments('--no-sandbox');           // Required in containers
options.addArguments('--disable-dev-shm-usage');// Prevent memory errors
options.addArguments('--disable-gpu');          // Stability in headless
// Headless mode (set HEADLESS=true env var):
options.addArguments('--headless=new');
```

---

## 🗂️ Git Setup

This project includes a `.gitignore` that excludes:

```gitignore
node_modules/      # Dependencies (reinstall via npm install)
reports/           # Auto-generated after each run
screenshots/       # Failure screenshots (generated at runtime)
*.log              # Log files
```

### Recommended Git Workflow

```bash
git init
git add .
git commit -m "feat: initial QA automation framework"
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

## 🚀 Future Improvements

- [ ] **Cross-browser Testing** — Add Firefox and Edge driver configurations
- [ ] **CI/CD Pipeline** — Add GitHub Actions workflow to run tests on every push
- [ ] **Data-Driven Testing** — Load test data from external JSON/CSV files
- [ ] **Retry on Failure** — Auto-retry flaky tests using `mocha-retry` plugin
- [ ] **Parallel Execution** — Run test files concurrently using `mocha-parallel-tests`
- [ ] **Allure Reports** — Replace Mochawesome with Allure for more detailed reporting
- [ ] **Docker Support** — Containerized test environment with `selenium/standalone-chrome`
- [ ] **Visual Regression** — Pixel-by-pixel comparison using `resemblejs` or `pixelmatch`
- [ ] **Newman CLI** — Run Postman collections from the terminal using `newman run`

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 👤 Author

Built as a professional QA Automation portfolio project demonstrating Selenium WebDriver, Mocha, Chai, Mochawesome, and Postman API testing best practices.
