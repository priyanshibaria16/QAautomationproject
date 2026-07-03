# QA Automation Framework

A professional end-to-end (E2E) automated testing framework utilizing the **Page Object Model (POM)** design pattern. This repository contains UI automated tests for the **SauceDemo** web application and API automated verification for **ReqRes** REST endpoints.

## 🚀 Technology Stack

- **Core Logic**: JavaScript (Node.js)
- **UI Automation**: Selenium WebDriver & ChromeDriver
- **Test Runner**: Mocha
- **Assertion Library**: Chai (using `expect` syntax)
- **Reporting**: Mochawesome (HTML/JSON reports)
- **API Testing**: Postman Collection (with pre-request and test assertion scripts)

### Why these tools?
1. **Node.js**: The runtime environment that runs our JavaScript tests outside the browser.
2. **Selenium WebDriver**: A industry-standard automation tool that provides a common API to control browsers natively.
3. **Mocha**: A highly flexible, feature-rich test runner that structures test suites (`describe`, `it`, `before`, `after`, etc.).
4. **Chai**: An assertion library that makes checks readable, supporting descriptive validations.
5. **Mochawesome**: Generates clean, responsive HTML reports detailing test runs, pass/fail status, execution times, and errors.
6. **Postman**: The leading API client tool to construct, document, and automate RESTful API tests with integrated JS scripts.

---

## 📁 Folder Structure

```text
QA-Automation-Framework/
├── pages/
│   ├── LoginPage.js          # Encapsulates username/password inputs and error banners
│   ├── ProductsPage.js       # Handles product listing, item prices, details, sorting, and logout menu
│   ├── CartPage.js           # Controls checking items in cart and cart navigation
│   └── CheckoutPage.js       # Handles customer detail inputs, order summary review, and confirmation
├── tests/
│   ├── login.test.js         # Mocha test suite for credentials and validation error scenarios
│   ├── products.test.js      # Mocha test suite for item lists, details, and sorting validations
│   ├── cart.test.js          # Mocha test suite for product addition, removal, and quantities
│   ├── checkout.test.js      # Mocha test suite for full purchasing flow and form validations
│   └── logout.test.js        # Mocha test suite for secure session termination and redirects
├── utils/
│   ├── driver.js             # Configures and instantiates the Chrome WebDriver (supports HEADLESS)
│   └── helper.js             # General utilities, including automatic screenshot capture on failures
├── reports/
│   ├── report.html           # Mochawesome-generated graphical test report
│   ├── report.json           # Raw JSON mocha test run output
│   └── screenshots/          # Automatically saved base64 screenshot PNGs from failed test cases
├── ReqRes_API_Collection.json # Standard Postman collection JSON ready for direct import
├── package.json              # Project dependencies and script runner commands
└── README.md                 # Project documentation
```

---

## ⚙️ Setup and Installation

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.x or above recommended)
- **Google Chrome** browser
- **Postman Desktop Client** (for API collections)

### 2. Framework Installation
Clone this repository (or copy it to your workspace) and run the following command to download all dependencies:
```bash
npm install
```
This automatically installs `selenium-webdriver`, `mocha`, `chai`, `chromedriver`, and `mochawesome` as specified in the `package.json`.

---

## 💻 Running UI Tests

The framework supports both **headful (standard windowed)** and **headless** execution modes.

### Run tests in Headless Mode (Recommended for CI/CD and Remote Runners):
#### Windows (PowerShell):
```powershell
$env:HEADLESS="true"; npm test
```

#### Linux/macOS:
```bash
HEADLESS=true npm test
```

### Run tests in Headful Mode (Launches standard Chrome window):
```bash
npm test
```

---

## 📊 Test Reports & Screenshots

### Graphical HTML Reports
After tests complete, Mochawesome compiles test results and generates an HTML file. Open the file directly in any browser:
- Path: `reports/report.html`

### Automatic Fail Screenshots
If any test case fails, the framework automatically triggers the `captureScreenshot` helper in the `afterEach` hook. 
- Captured screenshots are stored in `reports/screenshots/` with names matching the failing test description: `reports/screenshots/<test-description>_failed.png`.

---

## 📡 ReqRes API Testing (Postman)

The `ReqRes_API_Collection.json` file in the root folder contains the full Postman collection.

### Endpoints Covered:
1. **Login (`POST /api/login`)**: Validates response returns status `200` with a valid authorization token.
2. **Get Users (`GET /api/users?page=2`)**: Validates page parameter matching, items array schema, and email structure.
3. **Create User (`POST /api/users`)**: Validates `201 Created` status, properties matching sent payload, and automatic ID creation.
4. **Update User (`PUT /api/users/2`)**: Validates `200 OK` status and `updatedAt` field existence.
5. **Delete User (`DELETE /api/users/2`)**: Validates `204 No Content` status and empty response payload.

### Importing & Running in Postman:
1. Open the **Postman** desktop client.
2. Click **Import** in the top-left corner.
3. Choose/drag the `ReqRes_API_Collection.json` file from the project directory.
4. Click **Import** to load the collection.
5. Select the collection and run it via the **Collection Runner** to execute the JavaScript assertions.
