## Getting Started (development)

Install dependencies
```bash
npm install
```

then run the development server:

```bash
npm run dev
```

## Getting Started (testing)

Install Playwright browsers if you haven't already:

```bash
npx playwright install
```

Run all tests in headless mode (default):

```bash
npm test
```

Run tests with UI mode for debugging and development:

```bash
npm run test:ui
```

### Browser-specific testing

Run tests in specific browsers:

```bash
npm run test:chrome    # Run in Chromium only
npm run test:firefox   # Run in Firefox only
npm run test:webkit    # Run in WebKit only
```

### Visual testing options

Run tests in headed mode (with browser UI visible):

```bash
npm run test:headed            # All browsers
npm run test:chrome:headed     # Chromium only
npm run test:firefox:headed    # Firefox only
npm run test:webkit:headed     # WebKit only
```

### Debugging tests

```bash
npm run test:debug             # Run with Playwright debugger
npm run test:slow              # Run with slowed down actions
npm run test:debug:console     # Debug with console logs
npm run test:debug:verbose     # Debug with verbose output
```

### Advanced options

```bash
npm run test:trace             # Record traces for failed tests
npm run test:report            # Generate HTML test report
npm run test:update-snapshots  # Update visual snapshots
npm run test:single "test name" # Run a specific test by name
npm run test:parallel          # Run tests in parallel
npm run test:retry             # Run with automatic retries
```

View test reports after running tests with the report option:

```bash
npx playwright show-report
```
