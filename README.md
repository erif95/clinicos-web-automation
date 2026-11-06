# Lindenhof Booking App — Playwright E2E Tests

Playwright + TypeScript automated tests for the Lindenhof Family Practice booking application. The app is a **static HTML file**, opened directly with `file://`; **no server or `npm start` is required**.

## Requirements

- Node.js and npm installed (check with `node -v` and `npm -v`)
- Windows, macOS, or Linux

## Installation — for reviewers

1. Extract the ZIP file.
2. Open a terminal in the extracted **`lindenhof-playwright-e2e`** folder (the folder containing `package.json`).
3. Install all project dependencies with **one command**:

   ```bash
   npm install
   ```

   This installs Playwright, TypeScript, and `@types/node` from `package.json`. **Do not run a separate `npm install -D @types/node`**. The `fs`, `path`, and `url` modules are built into Node.js.

4. Install the browser binary (one-time setup on each machine):

   ```bash
   npx playwright install chromium
   ```

5. Run tests using any command below. No web server is needed.

> **Note:** `npm install` installs the test dependencies, but the separate `npx playwright install chromium` command is needed if the Playwright browser binary has not yet been installed on that machine.

## How to run tests

Run these commands from the project root (where `package.json` is located).

### All tests — headless (default)

```bash
npx playwright test
```

Runs **all 10 tests** in the background without showing a browser window.

### All tests — headed (visible browser)

```bash
npx playwright test --headed
```

Runs **all 10 tests** with the browser window visible. Useful for demos and screen recordings.

### Run one test by its title/string

Use `-g` (short for `--grep`) to match part of the test name:

```bash
npx playwright test -g "BUG-01"
```

Headed version:

```bash
npx playwright test -g "BUG-01" --headed
```

You can also match descriptive words from a test title:

```bash
npx playwright test -g "overlapping" --headed
npx playwright test -g "weekend" --headed
npx playwright test -g "cancelling" --headed
```

`-g` is **case-sensitive by default** and matches test titles using a regular expression. Use a unique bug ID such as `BUG-04` to select one scenario reliably.

### Run several tests by title

```bash
npx playwright test -g "BUG-01|BUG-02" --headed
```

### Run a specific test file

```bash
npx playwright test tests/booking-e2e.spec.ts
```

### Show the HTML report

```bash
npx playwright show-report
```

### Optional npm shortcuts

```bash
npm test                 # All tests, headless
npm run test:headed      # All tests, headed
npm run test:report      # Open the HTML report
```

## Test scenarios

| ID | Scenario | Expected behavior |
| --- | --- | --- |
| BUG-01 | Overlapping appointments | Reject overlapping bookings for the same doctor |
| BUG-02 | Cancellation removes wrong booking | Cancel only the selected patient's appointment |
| BUG-03 | Past date | Reject a booking date before today |
| BUG-04 | Past time today | Reject 08:00 when mocked Berlin time is 10:30 on a weekday |
| BUG-05 | Daylight saving time | Preserve the selected Berlin local appointment time |
| BUG-06 | After closing time | Reject an appointment ending after closing |
| BUG-07 | Invalid email | Reject a malformed email address |
| BUG-08 | Apostrophe in name | Accept names such as `Anne O'Connor` |
| BUG-09 | German characters | Accept names such as `Jürgen Müller` |

**Expected test outcomes:** BUG-01 through BUG-09 are intended to demonstrate defects in the supplied HTML (their assertions should fail until the relevant defects are fixed).

**Date handling:** Most tests use dynamically calculated Berlin dates. BUG-04 uses today's Berlin date, **skips on weekends**, and mocks the time to 10:30 Berlin; BUG-05 uses a fixed date to cover DST. This is why the number of executed tests can be fewer than 10 on weekends.

## How the local HTML is opened

The file `booking-app.html` is included in the project root. `playwright.config.ts` configures a `file://` base URL:

```typescript
import { pathToFileURL } from 'node:url';
import path from 'node:path';

baseURL: pathToFileURL(path.resolve(__dirname, 'booking-app.html')).href
```

Each test calls `BookingPage.open()`, which uses `BasePage.navigate('')` and ultimately `page.goto('')`. Playwright resolves the configured base URL to the local HTML file. **Do not manually change the file path for another machine**; it is resolved from the project directory.

## Project structure

```text
lindenhof-playwright-e2e/
├── booking-app.html
├── locators/
│   ├── AppointmentLocators.ts
│   └── BookingLocators.ts
├── pages/
│   ├── BasePage.ts
│   ├── BookingPage.ts
│   └── AppointmentPage.ts
├── testdata/
│   └── testdata.json
├── tests/
│   └── booking-e2e.spec.ts
├── types/
│   └── Appointment.ts
├── utility/
│   ├── DataReader.ts
│   └── berlinDates.ts
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Troubleshooting

**`npm ERR! ETARGET ... playwright-core@1.65.0`** — The package version selected by the registry may not have a matching published `playwright-core`. This project pins `@playwright/test` to `1.64.1` rather than using `latest`. If installation fails, check your registry and available versions:

```bash
npm config get registry
npm view @playwright/test@1.64.1 version
npm view playwright-core@1.64.1 version
```

**Browser executable not found** — Run:

```bash
npx playwright install chromium
```

**TypeScript complains about `fs` or Node.js types** — Ensure `npm install` succeeded and that `@types/node` is listed in `package.json`. No additional installation step should be necessary.

**Test fails with an assertion error** — Check whether it is an intended bug-reproduction failure. Open the report with `npx playwright show-report` and inspect the assertion and screenshots/traces.
